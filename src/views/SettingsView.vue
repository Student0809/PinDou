<template>
  <div class="page settings-page">
    <van-nav-bar title="设置中心" class="top-nav" />

    <div class="mobile-card settings-headline">
      <div class="headline-inner">
        <div>
          <p class="headline-label">当前告急阈值</p>
          <h2>{{ alertThreshold }} 颗</h2>
        </div>
        <van-tag round type="primary">记录 {{ records.length }} 条</van-tag>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">库存初始化</div>
      <div class="card-body">
        <van-field
          v-model="defaultQuantity"
          label="默认数量"
          type="number"
          placeholder="默认 1000"
          input-align="right"
        />
        <van-button type="primary" block round class="action-btn" @click="handleInitInventory">
          一键初始化 221 色
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">告急设置</div>
      <div class="card-body">
        <van-field
          v-model="alertThreshold"
          label="阈值"
          type="number"
          placeholder="低于该值将标记告急"
          input-align="right"
        />
        <van-button type="success" block round class="action-btn" @click="handleSaveThreshold">
          保存阈值
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">AI 配置</div>
      <div class="card-body">
        <van-field v-model="aiApiUrl" label="API地址" placeholder="https://.../v1/chat/completions" />
        <van-field v-model="aiApiKey" label="API Key" type="password" placeholder="请输入 API Key" />
        <van-field v-model="aiModel" label="模型名" placeholder="如 gpt-4.1-mini 或其他兼容模型" />
        <van-button type="primary" block round class="action-btn" @click="handleSaveAiConfig">
          保存 AI 配置
        </van-button>
      </div>
    </div>

    <div class="mobile-card">
      <div class="card-header">数据管理</div>
      <div class="card-body manage-actions">
        <van-button plain type="primary" round @click="showRecords = true">查看全部记录</van-button>
        <van-button plain type="success" round @click="handleExportData">导出数据</van-button>
        <van-button plain type="danger" round @click="handleClearData">清空数据</van-button>
      </div>
    </div>

    <van-popup v-model:show="showRecords" position="bottom" round :style="{ height: '82%' }">
      <div class="records-popup">
        <van-nav-bar title="操作记录" left-arrow @click-left="showRecords = false" />
        <div class="records-content">
          <RecordList :records="records" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant'
import { useInventoryStore } from '../stores/inventory'
import { useRecordsStore } from '../stores/records'
import { useSettingsStore } from '../stores/settings'
import { exportAllData, clearAllStorage } from '../utils/storage'
import RecordList from '../components/RecordList.vue'

const inventoryStore = useInventoryStore()
const recordsStore = useRecordsStore()
const settingsStore = useSettingsStore()

const defaultQuantity = ref(1000)
const alertThreshold = ref(300)
const aiApiUrl = ref('')
const aiApiKey = ref('')
const aiModel = ref('')
const showRecords = ref(false)

const records = computed(() => recordsStore.records)

const handleInitInventory = async () => {
  try {
    await showConfirmDialog({
      title: '确认初始化',
      message: '将清空当前库存并初始化 221 色，确定继续吗？'
    })

    const qty = parseInt(defaultQuantity.value, 10)
    if (Number.isNaN(qty) || qty <= 0) {
      showFailToast('请输入有效的默认数量')
      return
    }

    inventoryStore.initInventory(qty)
    showSuccessToast('库存初始化成功')
  } catch {
    // 用户取消
  }
}

const handleSaveThreshold = () => {
  const value = parseInt(alertThreshold.value, 10)
  if (Number.isNaN(value) || value < 0) {
    showFailToast('请输入有效的阈值')
    return
  }

  settingsStore.alertThreshold = value
  settingsStore.saveSettings()
  showSuccessToast('告急阈值已保存')
}

const handleSaveAiConfig = () => {
  if (!aiApiUrl.value || !aiApiKey.value || !aiModel.value) {
    showFailToast('请填写完整的 AI 配置')
    return
  }

  const config = {
    apiUrl: aiApiUrl.value,
    apiKey: aiApiKey.value,
    modelName: aiModel.value,
    model: aiModel.value
  }

  settingsStore.saveAiConfig(config)
  showSuccessToast('AI 配置保存成功')
}

const handleExportData = () => {
  const data = exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pindou-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  showSuccessToast('导出成功')
}

const handleClearData = async () => {
  try {
    await showConfirmDialog({
      title: '清空数据',
      message: '这会删除库存、记录和设置，且不可恢复，确认继续吗？'
    })

    clearAllStorage()
    showSuccessToast('数据已清空')
    setTimeout(() => window.location.reload(), 800)
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  alertThreshold.value = settingsStore.alertThreshold

  if (settingsStore.aiConfig) {
    aiApiUrl.value = settingsStore.aiConfig.apiUrl || ''
    aiApiKey.value = settingsStore.aiConfig.apiKey || ''
    aiModel.value = settingsStore.aiConfig.modelName || settingsStore.aiConfig.model || ''
  }
})
</script>

<style scoped>
.settings-page {
  background: transparent;
}

.top-nav {
  background: transparent;
}

.settings-headline {
  margin-top: 8px;
  background: linear-gradient(150deg, #fff6d9 0%, #ffe8af 100%);
}

.headline-inner {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.headline-label {
  color: #8f681b;
  font-size: 13px;
}

.headline-inner h2 {
  margin-top: 4px;
  font-size: 28px;
  color: #8b5c10;
}

.action-btn {
  margin-top: 14px;
}

.manage-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.manage-actions :deep(.van-button:last-child) {
  grid-column: 1 / -1;
}

.records-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--pd-bg);
}

.records-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
}
</style>
