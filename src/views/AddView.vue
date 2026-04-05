<template>
  <div class="page add-page">
    <van-nav-bar title="豆子入库" class="top-nav" />

    <div class="mobile-card headline-card">
      <div class="headline-inner">
        <div>
          <p class="headline-label">今日入库</p>
          <h2>+{{ todayAddTotal }} 颗</h2>
        </div>
        <van-tag round type="success">{{ recentAddRecords.length }} 条最近记录</van-tag>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">手动入库</div>
      <div class="card-body">
        <ColorSelect v-model="selectedColor" label="色号" placeholder="选择要入库的色号" />

        <van-field
          v-model="quantity"
          type="number"
          label="数量"
          placeholder="输入颗数"
          input-align="right"
        />

        <div class="pill-row quick-row">
          <van-button plain type="primary" size="small" round @click="setQuickQty(500)">500</van-button>
          <van-button plain type="primary" size="small" round @click="setQuickQty(1000)">1000</van-button>
          <van-button plain type="primary" size="small" round @click="setQuickQty(1200)">1200</van-button>
        </div>

        <van-button type="primary" block round class="action-btn" :disabled="!canAdd" @click="handleManualAdd">
          确认入库
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">批量入库</div>
      <div class="card-body">
        <van-notice-bar left-icon="info-o" wrapable text="支持格式：A1 1000, B2 500，可换行输入。" />

        <van-field
          v-model="batchInput"
          rows="5"
          autosize
          type="textarea"
          class="batch-field"
          placeholder="A1 1000&#10;B2 500"
        />

        <p class="batch-preview" v-if="batchPreviewCount > 0">已识别 {{ batchPreviewCount }} 项待入库</p>

        <van-button type="primary" block round :disabled="!batchInput" @click="handleBatchAdd">
          批量入库
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">最近入库记录</div>
      <div class="card-body">
        <RecordList :records="recentAddRecords" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import ColorSelect from '../components/ColorSelect.vue'
import RecordList from '../components/RecordList.vue'
import { useInventoryStore } from '../stores/inventory'
import { useRecordsStore } from '../stores/records'
import { parseBatchInput, isValidColorCode } from '../utils/parser'
import { colorCodes } from '../data/colors'

const route = useRoute()
const inventoryStore = useInventoryStore()
const recordsStore = useRecordsStore()

const selectedColor = ref('')
const quantity = ref('')
const batchInput = ref('')

onMounted(() => {
  if (route.query.color) {
    selectedColor.value = route.query.color
  }
})

const canAdd = computed(() => selectedColor.value && quantity.value && parseInt(quantity.value, 10) > 0)

const recentAddRecords = computed(() => recordsStore.addRecords.slice(0, 10))

const todayAddTotal = computed(() => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return recordsStore.addRecords
    .filter((r) => r.timestamp >= start.getTime())
    .reduce((sum, r) => sum + r.quantity, 0)
})

const batchPreviewCount = computed(() => parseBatchInput(batchInput.value).length)

const setQuickQty = (qty) => {
  quantity.value = qty.toString()
}

const handleManualAdd = () => {
  const qty = parseInt(quantity.value, 10)
  if (!selectedColor.value || qty <= 0) {
    showFailToast('请选择色号并输入有效数量')
    return
  }

  inventoryStore.addQuantity(selectedColor.value, qty)
  recordsStore.addRecord('add', selectedColor.value, qty)
  showSuccessToast(`成功入库 ${selectedColor.value} ${qty} 颗`)
  quantity.value = ''
}

const handleBatchAdd = () => {
  const items = parseBatchInput(batchInput.value)

  if (items.length === 0) {
    showFailToast('未识别到有效的入库数据')
    return
  }

  let successCount = 0
  let failCount = 0

  for (const item of items) {
    if (isValidColorCode(item.colorCode, colorCodes)) {
      inventoryStore.addQuantity(item.colorCode, item.quantity)
      recordsStore.addRecord('add', item.colorCode, item.quantity)
      successCount++
    } else {
      failCount++
    }
  }

  if (failCount > 0) {
    showFailToast(`成功 ${successCount} 项，无效色号 ${failCount} 项`)
  } else {
    showSuccessToast(`成功入库 ${successCount} 项`)
  }

  batchInput.value = ''
}
</script>

<style scoped>
.add-page {
  background: transparent;
}

.top-nav {
  background: transparent;
}

.headline-card {
  margin-top: 8px;
  background: linear-gradient(150deg, #f6f9ef 0%, #e7f3d5 100%);
}

.headline-inner {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.headline-label {
  color: #557949;
  font-size: 13px;
}

.headline-inner h2 {
  margin-top: 4px;
  font-size: 28px;
  color: #2e8f5b;
}

.quick-row {
  margin-top: 10px;
}

.action-btn {
  margin-top: 14px;
}

.batch-field {
  margin: 10px 0;
  border-radius: 12px;
  border: 1px solid rgba(82, 117, 69, 0.2);
  background: #fbfff6;
}

.batch-preview {
  color: #557949;
  margin-bottom: 10px;
  font-size: 13px;
}
</style>
