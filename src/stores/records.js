import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

export const useRecordsStore = defineStore('records', () => {
  // 状态
  const records = ref(getStorage(STORAGE_KEYS.RECORDS) || [])

  // 生成ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 添加记录
  const addRecord = (type, colorCode, quantity, note = '') => {
    const record = {
      id: generateId(),
      type, // 'add' | 'consume'
      colorCode,
      quantity,
      timestamp: Date.now(),
      note
    }
    records.value.unshift(record) // 新记录在前
    saveToStorage()
    return record
  }

  // 保存到存储
  const saveToStorage = () => {
    setStorage(STORAGE_KEYS.RECORDS, records.value)
  }

  // 清空记录
  const clearRecords = () => {
    records.value = []
    saveToStorage()
  }

  // 入库记录
  const addRecords = computed(() => {
    return records.value.filter(r => r.type === 'add')
  })

  // 消耗记录
  const consumeRecords = computed(() => {
    return records.value.filter(r => r.type === 'consume')
  })

  // 最近记录
  const recentRecords = computed(() => {
    return records.value.slice(0, 20)
  })

  return {
    records,
    addRecord,
    clearRecords,
    addRecords,
    consumeRecords,
    recentRecords
  }
})
