<template>
  <div class="page consume-page">
    <van-nav-bar title="豆子消耗" class="top-nav" />

    <div class="mobile-card consume-headline">
      <div class="headline-inner">
        <div>
          <p class="headline-label">今日消耗</p>
          <h2>-{{ todayConsumeTotal }} 颗</h2>
        </div>
        <van-tag round type="danger" v-if="!aiConfigured">AI未配置</van-tag>
        <van-tag round type="success" v-else>AI已可用</van-tag>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">手动消耗</div>
      <div class="card-body">
        <ColorSelect v-model="selectedColor" label="色号" placeholder="选择要消耗的色号" />

        <van-field
          v-model="quantity"
          type="number"
          label="数量"
          placeholder="输入颗数"
          input-align="right"
        />

        <div v-if="selectedColor" class="stock-info">
          当前库存 {{ selectedColor }}：<strong>{{ inventoryStore.getQuantity(selectedColor) }}</strong> 颗
        </div>

        <div class="pill-row quick-row">
          <van-button plain type="danger" size="small" round @click="setQuickQty(500)">500</van-button>
          <van-button plain type="danger" size="small" round @click="setQuickQty(1000)">1000</van-button>
          <van-button plain type="danger" size="small" round @click="setQuickQty(1200)">1200</van-button>
        </div>

        <van-button type="danger" block round class="action-btn" :disabled="!canConsume" @click="handleManualConsume">
          确认消耗
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">批量消耗</div>
      <div class="card-body">
        <van-field
          v-model="batchInput"
          rows="5"
          autosize
          type="textarea"
          class="batch-field"
          placeholder="A1 500&#10;B2 200"
        />

        <p class="batch-preview" v-if="batchPreviewCount > 0">已识别 {{ batchPreviewCount }} 项待消耗</p>

        <van-button type="danger" block round :disabled="!batchInput" @click="handleBatchConsume">
          批量消耗
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">AI识别消耗</div>
      <div class="card-body">
        <van-uploader
          v-model="fileList"
          :max-count="1"
          :after-read="handleImageSelected"
          :preview-full-image="false"
          accept="image/*"
          preview-size="90px"
          @click-preview="handlePreviewClick"
        />

        <p class="ai-tip" v-if="!aiConfigured">请先去设置页填写 API Key。</p>

        <van-button
          type="danger"
          block
          round
          class="action-btn"
          :disabled="!selectedImage || !aiConfigured"
          @click="handleAIRecognize"
        >
          开始识别并生成消耗清单
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">最近消耗记录</div>
      <div class="card-body">
        <RecordList :records="recentConsumeRecords" />
      </div>
    </div>

    <ImageCropper
      v-model:show="showCropper"
      :image-src="selectedImageSrc"
      @confirm="handleCropConfirm"
      @cancel="handleCropCancel"
    />

    <van-dialog
      v-model:show="showResultDialog"
      title="确认识别结果"
      show-cancel-button
      confirm-button-text="确认消耗"
      @confirm="confirmAIResult"
    >
      <div class="result-dialog">
        <van-field
          v-model="editedResult"
          type="textarea"
          rows="6"
          placeholder="格式：A1 1000, B2 500"
        />
      </div>
    </van-dialog>

    <van-image-preview
      v-model:show="showImagePreview"
      :images="previewImages"
      :start-position="previewStartIndex"
      closeable
      close-icon="clear"
      :close-on-click-image="true"
      :close-on-click-overlay="true"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant'
import ColorSelect from '../components/ColorSelect.vue'
import RecordList from '../components/RecordList.vue'
import ImageCropper from '../components/ImageCropper.vue'
import { useInventoryStore } from '../stores/inventory'
import { useRecordsStore } from '../stores/records'
import { useSettingsStore } from '../stores/settings'
import { parseBatchInput, isValidColorCode } from '../utils/parser'
import { recognizeImage, fileToBase64, FIXED_AI_API_URL, FIXED_AI_MODEL } from '../utils/ai'
import { colorCodes } from '../data/colors'

const inventoryStore = useInventoryStore()
const recordsStore = useRecordsStore()
const settingsStore = useSettingsStore()

const selectedColor = ref('')
const quantity = ref('')
const batchInput = ref('')
const fileList = ref([])
const selectedImage = ref(null)
const selectedImageSrc = ref('')
const showCropper = ref(false)
const showResultDialog = ref(false)
const editedResult = ref('')
const showImagePreview = ref(false)
const previewStartIndex = ref(0)

const aiConfigured = computed(() => {
  const config = settingsStore.aiConfig
  return Boolean(config?.apiKey)
})

const canConsume = computed(() => selectedColor.value && quantity.value && parseInt(quantity.value, 10) > 0)
const recentConsumeRecords = computed(() => recordsStore.consumeRecords.slice(0, 10))
const batchPreviewCount = computed(() => parseBatchInput(batchInput.value).length)
const previewImages = computed(() =>
  fileList.value
    .map(item => item?.url || item?.content || '')
    .filter(Boolean)
)

const todayConsumeTotal = computed(() => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return recordsStore.consumeRecords
    .filter((r) => r.timestamp >= start.getTime())
    .reduce((sum, r) => sum + r.quantity, 0)
})

const normalizeAIConfig = () => {
  const cfg = settingsStore.aiConfig || {}
  return {
    apiUrl: FIXED_AI_API_URL,
    apiKey: cfg.apiKey,
    modelName: FIXED_AI_MODEL
  }
}

const processConsumeItems = (items, note = '') => {
  let successCount = 0
  let invalidCodeCount = 0
  let insufficientCount = 0

  for (const item of items) {
    if (!isValidColorCode(item.colorCode, colorCodes)) {
      invalidCodeCount++
      continue
    }

    const currentStock = inventoryStore.getQuantity(item.colorCode)
    if (currentStock < item.quantity) {
      insufficientCount++
      continue
    }

    inventoryStore.reduceQuantity(item.colorCode, item.quantity)
    recordsStore.addRecord('consume', item.colorCode, item.quantity, note)
    successCount++
  }

  const failCount = invalidCodeCount + insufficientCount

  if (failCount > 0) {
    showFailToast(`成功 ${successCount} 项，库存不足 ${insufficientCount} 项，无效色号 ${invalidCodeCount} 项`)
  } else {
    showSuccessToast(`成功消耗 ${successCount} 项`)
  }
}

const setQuickQty = (qty) => {
  quantity.value = qty.toString()
}

const handleManualConsume = () => {
  const qty = parseInt(quantity.value, 10)
  if (!selectedColor.value || qty <= 0) {
    showFailToast('请选择色号并输入有效数量')
    return
  }

  const currentStock = inventoryStore.getQuantity(selectedColor.value)
  if (currentStock < qty) {
    showFailToast(`库存不足，当前库存：${currentStock} 颗`)
    return
  }

  inventoryStore.reduceQuantity(selectedColor.value, qty)
  recordsStore.addRecord('consume', selectedColor.value, qty)
  showSuccessToast(`成功消耗 ${selectedColor.value} ${qty} 颗`)
  quantity.value = ''
}

const handleBatchConsume = () => {
  const items = parseBatchInput(batchInput.value)

  if (items.length === 0) {
    showFailToast('未识别到有效的消耗数据')
    return
  }

  processConsumeItems(items)
  batchInput.value = ''
}

const handleImageSelected = async (file) => {
  if (!file.file) {
    return
  }

  try {
    selectedImageSrc.value = await fileToBase64(file.file)
    showCropper.value = true
  } catch {
    showFailToast('图片加载失败')
  }
}

const handleCropConfirm = (base64) => {
  selectedImage.value = base64
  selectedImageSrc.value = base64
  fileList.value = [
    {
      url: base64,
      content: base64,
      isImage: true,
      status: ''
    }
  ]
}

const handleCropCancel = () => {
  fileList.value = []
  selectedImage.value = null
  selectedImageSrc.value = ''
}

const handleAIRecognize = async () => {
  if (!selectedImage.value) {
    showFailToast('请先选择图片')
    return
  }

  showLoadingToast({ message: '正在识别...', forbidClick: true, duration: 0 })

  try {
    const result = await recognizeImage(selectedImage.value, normalizeAIConfig())
    editedResult.value = result
    showResultDialog.value = true
  } catch (error) {
    showFailToast(error.message || '识别失败，请重试')
  } finally {
    closeToast()
  }
}

const handlePreviewClick = (payload) => {
  previewStartIndex.value = payload?.index || 0
  showImagePreview.value = true
}

const confirmAIResult = () => {
  const items = parseBatchInput(editedResult.value)

  if (items.length === 0) {
    showFailToast('未识别到有效的消耗数据')
    return
  }

  processConsumeItems(items, 'AI识别')

  fileList.value = []
  selectedImage.value = null
  selectedImageSrc.value = ''
  showResultDialog.value = false
}
</script>

<style scoped>
.consume-page {
  background: transparent;
}

.top-nav {
  background: transparent;
}

.consume-headline {
  margin-top: 8px;
  background: linear-gradient(150deg, #fff0ed 0%, #ffd7ce 100%);
}

.headline-inner {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.headline-label {
  color: #9f4536;
  font-size: 13px;
}

.headline-inner h2 {
  margin-top: 4px;
  font-size: 28px;
  color: #bb3b29;
}

.stock-info {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff4ef;
  color: #9f4536;
}

.quick-row {
  margin-top: 10px;
}

.action-btn {
  margin-top: 14px;
}

.batch-field {
  border-radius: 12px;
  border: 1px solid rgba(217, 74, 52, 0.2);
  background: #fff9f8;
}

.batch-preview {
  color: #9f4536;
  margin: 10px 0;
  font-size: 13px;
}

.ai-tip {
  margin-top: 8px;
  color: #9f4536;
  font-size: 13px;
}

.result-dialog {
  padding: 16px;
}
</style>
