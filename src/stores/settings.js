import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

export const useSettingsStore = defineStore('settings', () => {
  // 告急阈值
  const alertThreshold = ref(300)

  // AI配置
  const aiConfig = ref(null)

  // 从存储加载
  const loadFromStorage = () => {
    const settings = getStorage(STORAGE_KEYS.SETTINGS)
    if (settings) {
      alertThreshold.value = settings.alertThreshold || 300
    }
    const config = getStorage(STORAGE_KEYS.AI_CONFIG)
    if (config) {
      aiConfig.value = config
    }
  }

  // 保存设置
  const saveSettings = () => {
    setStorage(STORAGE_KEYS.SETTINGS, {
      alertThreshold: alertThreshold.value
    })
  }

  // 保存AI配置
  const saveAiConfig = (config) => {
    aiConfig.value = config
    setStorage(STORAGE_KEYS.AI_CONFIG, config)
  }

  // 清除AI配置
  const clearAiConfig = () => {
    aiConfig.value = null
    setStorage(STORAGE_KEYS.AI_CONFIG, null)
  }

  // 初始化时加载
  loadFromStorage()

  return {
    alertThreshold,
    aiConfig,
    saveSettings,
    saveAiConfig,
    clearAiConfig,
    loadFromStorage
  }
})
