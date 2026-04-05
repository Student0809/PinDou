const STORAGE_KEYS = {
  INVENTORY: 'pindou_inventory',
  RECORDS: 'pindou_records',
  SETTINGS: 'pindou_settings',
  AI_CONFIG: 'pindou_ai_config'
}

// 获取数据
export function getStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// 设置数据
export function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// 移除数据
export function removeStorage(key) {
  localStorage.removeItem(key)
}

// 清空所有数据
export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

// 导出所有数据
export function exportAllData() {
  return {
    inventory: getStorage(STORAGE_KEYS.INVENTORY) || [],
    records: getStorage(STORAGE_KEYS.RECORDS) || [],
    settings: getStorage(STORAGE_KEYS.SETTINGS) || { alertThreshold: 300 },
    aiConfig: getStorage(STORAGE_KEYS.AI_CONFIG) || null,
    exportTime: new Date().toISOString()
  }
}

// 导入数据
export function importAllData(data) {
  if (data.inventory) setStorage(STORAGE_KEYS.INVENTORY, data.inventory)
  if (data.records) setStorage(STORAGE_KEYS.RECORDS, data.records)
  if (data.settings) setStorage(STORAGE_KEYS.SETTINGS, data.settings)
  if (data.aiConfig) setStorage(STORAGE_KEYS.AI_CONFIG, data.aiConfig)
}

export { STORAGE_KEYS }
