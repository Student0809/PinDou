import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'
import { colorCodes, getSeries, colorSeries } from '../data/colors'

export const useInventoryStore = defineStore('inventory', () => {
  // 状态
  const items = ref(getStorage(STORAGE_KEYS.INVENTORY) || [])

  // 获取单个色号的库存
  const getQuantity = (colorCode) => {
    const item = items.value.find(i => i.colorCode === colorCode)
    return item ? item.quantity : 0
  }

  // 设置库存
  const setQuantity = (colorCode, quantity) => {
    const index = items.value.findIndex(i => i.colorCode === colorCode)
    if (index >= 0) {
      items.value[index].quantity = quantity
    } else {
      items.value.push({ colorCode, quantity })
    }
    saveToStorage()
  }

  // 增加库存
  const addQuantity = (colorCode, quantity) => {
    const current = getQuantity(colorCode)
    setQuantity(colorCode, current + quantity)
  }

  // 减少库存
  const reduceQuantity = (colorCode, quantity) => {
    const current = getQuantity(colorCode)
    setQuantity(colorCode, Math.max(0, current - quantity))
  }

  // 保存到存储
  const saveToStorage = () => {
    setStorage(STORAGE_KEYS.INVENTORY, items.value)
  }

  // 初始化库存
  const initInventory = (defaultQuantity = 1000) => {
    items.value = colorCodes.map(colorCode => ({
      colorCode,
      quantity: defaultQuantity
    }))
    saveToStorage()
  }

  // 清空库存
  const clearInventory = () => {
    items.value = []
    saveToStorage()
  }

  // 是否已初始化
  const isInitialized = computed(() => items.value.length > 0)

  // 总数量
  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 按色系统计
  const quantityBySeries = computed(() => {
    const result = {}
    colorSeries.forEach(series => {
      result[series] = items.value
        .filter(i => i.colorCode.startsWith(series))
        .reduce((sum, item) => sum + item.quantity, 0)
    })
    return result
  })

  return {
    items,
    getQuantity,
    setQuantity,
    addQuantity,
    reduceQuantity,
    initInventory,
    clearInventory,
    isInitialized,
    totalQuantity,
    quantityBySeries
  }
})
