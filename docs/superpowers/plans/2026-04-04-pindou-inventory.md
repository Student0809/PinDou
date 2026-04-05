# AI拼豆库存管理实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个移动端PWA网页应用，用于管理拼豆库存，支持入库、消耗、AI识别和统计功能。

**Architecture:** Vue 3 + Vite + Vant 4 + Pinia 单页应用，使用 localStorage 持久化数据，底部 Tab 导航四个功能页面。

**Tech Stack:** Vue 3, Vite, Vant 4, Pinia, Vue Router, localStorage, cropperjs, vite-plugin-pwa

---

## 文件结构

```
src/
├── main.js                 # 入口文件
├── App.vue                 # 根组件
├── router/
│   └── index.js            # 路由配置
├── stores/
│   ├── inventory.js        # 库存状态管理
│   ├── records.js          # 记录状态管理
│   └── settings.js         # 设置状态管理
├── views/
│   ├── Inventory.vue       # 库存页面
│   ├── AddStock.vue        # 入库页面
│   ├── Consume.vue         # 消耗页面
│   └── Settings.vue        # 设置页面
├── components/
│   ├── ColorSelect.vue     # 色号选择组件
│   ├── RecordList.vue      # 记录列表组件
│   └── ImageCropper.vue    # 图片裁剪组件
├── utils/
│   ├── storage.js          # localStorage封装
│   ├── parser.js           # 文本解析工具
│   └── ai.js               # AI API调用封装
├── data/
│   └── colors.js           # 221色号数据
└── assets/
    └── main.css            # 全局样式
```

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/assets/main.css`

- [ ] **Step 1: 创建项目目录和初始化 npm 项目**

```bash
cd F:/AIpindou
npm init -y
```

- [ ] **Step 2: 安装依赖**

```bash
npm install vue vue-router pinia vant@4
npm install -D vite @vitejs/plugin-vue vite-plugin-pwa cropperjs
```

- [ ] **Step 3: 创建 vite.config.js**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AI拼豆',
        short_name: '拼豆',
        description: '拼豆库存管理',
        theme_color: '#1989fa',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
```

- [ ] **Step 4: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#1989fa">
  <link rel="icon" type="image/svg+xml" href="/vite.svg">
  <title>AI拼豆</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: 创建 src/main.js**

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **Step 6: 创建 src/App.vue**

```vue
<template>
  <div class="app-container">
    <router-view />
    <van-tabbar route>
      <van-tabbar-item to="/inventory" icon="apps">库存</van-tabbar-item>
      <van-tabbar-item to="/add" icon="add">入库</van-tabbar-item>
      <van-tabbar-item to="/consume" icon="minus">消耗</van-tabbar-item>
      <van-tabbar-item to="/settings" icon="setting">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
</script>

<style>
.app-container {
  min-height: 100vh;
  padding-bottom: 50px;
}
</style>
```

- [ ] **Step 7: 创建 src/assets/main.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f7f8fa;
}

.alert-item {
  color: #ee0a24;
  font-weight: bold;
}
```

- [ ] **Step 8: 更新 package.json 添加 scripts**

```json
{
  "name": "pindou",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pinia": "^2.1.7",
    "vant": "^4.8.0",
    "vue": "^3.4.0",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "cropperjs": "^1.6.1",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

- [ ] **Step 9: 验证项目可以启动**

```bash
npm run dev
```
Expected: 开发服务器启动成功，访问 http://localhost:3000

---

## Task 2: 路由配置

**Files:**
- Create: `src/router/index.js`
- Create: `src/views/Inventory.vue` (占位)
- Create: `src/views/AddStock.vue` (占位)
- Create: `src/views/Consume.vue` (占位)
- Create: `src/views/Settings.vue` (占位)

- [ ] **Step 1: 创建路由配置 src/router/index.js**

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/inventory'
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue')
  },
  {
    path: '/add',
    name: 'AddStock',
    component: () => import('../views/AddStock.vue')
  },
  {
    path: '/consume',
    name: 'Consume',
    component: () => import('../views/Consume.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

- [ ] **Step 2: 创建占位页面 src/views/Inventory.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="库存" />
    <div class="content">
      <p>库存页面</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page {
  height: 100%;
}
.content {
  padding: 16px;
}
</style>
```

- [ ] **Step 3: 创建占位页面 src/views/AddStock.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="入库" />
    <div class="content">
      <p>入库页面</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page {
  height: 100%;
}
.content {
  padding: 16px;
}
</style>
```

- [ ] **Step 4: 创建占位页面 src/views/Consume.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="消耗" />
    <div class="content">
      <p>消耗页面</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page {
  height: 100%;
}
.content {
  padding: 16px;
}
</style>
```

- [ ] **Step 5: 创建占位页面 src/views/Settings.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="设置" />
    <div class="content">
      <p>设置页面</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page {
  height: 100%;
}
.content {
  padding: 16px;
}
</style>
```

- [ ] **Step 6: 验证路由跳转正常**

```bash
npm run dev
```
Expected: 可以看到Tab导航，点击可以切换页面

---

## Task 3: 色号数据和工具函数

**Files:**
- Create: `src/data/colors.js`
- Create: `src/utils/storage.js`
- Create: `src/utils/parser.js`

- [ ] **Step 1: 创建色号数据 src/data/colors.js**

```javascript
// 从色号.txt解析出的所有色号
export const colorCodes = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
  'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20',
  'A21', 'A22', 'A23', 'A24', 'A25', 'A26',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
  'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20',
  'B21', 'B22', 'B23', 'B24', 'B25', 'B26', 'B27', 'B28', 'B29', 'B30',
  'B31', 'B32',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
  'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20',
  'C21', 'C22', 'C23', 'C24', 'C25', 'C26', 'C27', 'C28', 'C29',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
  'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20',
  'D21', 'D22', 'D23', 'D24', 'D25', 'D26',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
  'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20',
  'E21', 'E22', 'E23', 'E24', 'E25',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10',
  'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20',
  'F21', 'F22', 'F23', 'F24', 'F25',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10',
  'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20',
  'G21',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10',
  'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20',
  'H21', 'H22', 'H23',
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10',
  'M11', 'M12', 'M13', 'M14', 'M15'
]

// 色系列表
export const colorSeries = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M']

// 根据色号获取色系
export function getSeries(colorCode) {
  return colorCode.replace(/[0-9]/g, '')
}

// 获取某色系的所有色号
export function getColorsBySeries(series) {
  return colorCodes.filter(c => c.startsWith(series))
}

// 按色系分组
export function groupBySeries(colors) {
  const groups = {}
  colorSeries.forEach(s => {
    groups[s] = colors.filter(c => c.startsWith(s))
  })
  return groups
}
```

- [ ] **Step 2: 创建存储工具 src/utils/storage.js**

```javascript
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
```

- [ ] **Step 3: 创建解析工具 src/utils/parser.js**

```javascript
// 解析批量输入字符串
// 支持格式: "A1 1000" 或 "A1 1000, B2 500" 或每行一个
export function parseBatchInput(text) {
  const result = []
  // 支持逗号、换行、空格分隔
  const lines = text.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
  
  for (const line of lines) {
    // 匹配格式: 色号 + 数字
    const match = line.match(/^([A-Za-z]+\d+)\s+(\d+)/)
    if (match) {
      result.push({
        colorCode: match[1].toUpperCase(),
        quantity: parseInt(match[2], 10)
      })
    }
  }
  
  return result
}

// 格式化批量输出
export function formatBatchOutput(items) {
  return items.map(item => `${item.colorCode} ${item.quantity}`).join(', ')
}

// 验证色号是否有效
export function isValidColorCode(code, validCodes) {
  return validCodes.includes(code.toUpperCase())
}
```

- [ ] **Step 4: 提交代码**

```bash
git add src/data/colors.js src/utils/storage.js src/utils/parser.js
git commit -m "feat: add color codes data and utility functions"
```

---

## Task 4: 状态管理 Store

**Files:**
- Create: `src/stores/inventory.js`
- Create: `src/stores/records.js`
- Create: `src/stores/settings.js`

- [ ] **Step 1: 创建库存 Store src/stores/inventory.js**

```javascript
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
```

- [ ] **Step 2: 创建记录 Store src/stores/records.js**

```javascript
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
```

- [ ] **Step 3: 创建设置 Store src/stores/settings.js**

```javascript
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
```

- [ ] **Step 4: 提交代码**

```bash
git add src/stores/
git commit -m "feat: add pinia stores for inventory, records and settings"
```

---

## Task 5: AI API 封装

**Files:**
- Create: `src/utils/ai.js`

- [ ] **Step 1: 创建 AI 工具 src/utils/ai.js**

```javascript
// 调用AI API识别图片
export async function recognizeImage(imageBase64, config) {
  const { apiUrl, apiKey, modelName } = config
  
  if (!apiUrl || !apiKey || !modelName) {
    throw new Error('请先配置AI API')
  }
  
  const prompt = `请识别这张图片中的拼豆色号和数量。
输出格式为：色号 数量，多个用逗号或换行分隔。
例如：A1 100, B2 50, C3 30
只输出色号和数量，不要输出其他内容。`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API调用失败')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('AI识别失败:', error)
    throw error
  }
}

// 将文件转换为base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 裁剪图片并返回base64
export function cropImageToBase64(imageElement, cropper) {
  const canvas = cropper.getCroppedCanvas({
    maxWidth: 1024,
    maxHeight: 1024,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
  
  return canvas.toDataURL('image/jpeg', 0.8)
}
```

- [ ] **Step 2: 提交代码**

```bash
git add src/utils/ai.js
git commit -m "feat: add AI API utility for image recognition"
```

---

## Task 6: 色号选择组件

**Files:**
- Create: `src/components/ColorSelect.vue`

- [ ] **Step 1: 创建色号选择组件 src/components/ColorSelect.vue**

```vue
<template>
  <van-field
    v-model="displayValue"
    is-link
    readonly
    :label="label"
    :placeholder="placeholder"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" position="bottom" round>
    <van-picker-group
      title="选择色号"
      :tabs="['全部', 'A系', 'B系', 'C系', 'D系', 'E系', 'F系', 'G系', 'H系', 'M系']"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    >
      <template #toolbar>
        <van-search
          v-model="searchText"
          placeholder="搜索色号"
          style="padding: 8px 16px;"
        />
      </template>
      <van-picker
        v-for="(tab, tabIndex) in filteredOptions"
        :key="tabIndex"
        :columns="tab"
        @confirm="(val) => onSelect(val.selectedValues[0])"
      />
    </van-picker-group>
  </van-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { colorCodes, getColorsBySeries, colorSeries } from '../data/colors'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: '色号'
  },
  placeholder: {
    type: String,
    default: '请选择色号'
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const searchText = ref('')
const displayValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  displayValue.value = val
})

// 所有选项
const allOptions = computed(() => {
  let codes = colorCodes
  if (searchText.value) {
    codes = codes.filter(c => 
      c.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  return codes.map(c => ({ text: c, value: c }))
})

// 按色系分组的选项
const filteredOptions = computed(() => {
  const options = [allOptions.value]
  colorSeries.forEach(series => {
    let codes = getColorsBySeries(series)
    if (searchText.value) {
      codes = codes.filter(c => 
        c.toLowerCase().includes(searchText.value.toLowerCase())
      )
    }
    options.push(codes.map(c => ({ text: c, value: c })))
  })
  return options
})

const onSelect = (value) => {
  displayValue.value = value
  emit('update:modelValue', value)
  showPicker.value = false
  searchText.value = ''
}

const onConfirm = () => {
  showPicker.value = false
  searchText.value = ''
}
</script>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/components/ColorSelect.vue
git commit -m "feat: add color select component"
```

---

## Task 7: 记录列表组件

**Files:**
- Create: `src/components/RecordList.vue`

- [ ] **Step 1: 创建记录列表组件 src/components/RecordList.vue**

```vue
<template>
  <div class="record-list">
    <van-cell-group v-if="records.length > 0">
      <van-cell
        v-for="record in records"
        :key="record.id"
        :title="record.colorCode"
        :value="formatValue(record)"
        :label="formatTime(record.timestamp)"
        :value-class="record.type === 'consume' ? 'consume-value' : 'add-value'"
      >
        <template #icon>
          <span :class="record.type === 'consume' ? 'icon-minus' : 'icon-plus'">
            {{ record.type === 'consume' ? '-' : '+' }}
          </span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="暂无记录" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const formatValue = (record) => {
  const sign = record.type === 'consume' ? '-' : '+'
  return `${sign}${record.quantity}`
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}
</script>

<style scoped>
.record-list {
  margin-top: 12px;
}

.icon-plus {
  color: #07c160;
  margin-right: 8px;
  font-weight: bold;
}

.icon-minus {
  color: #ee0a24;
  margin-right: 8px;
  font-weight: bold;
}

.add-value {
  color: #07c160;
}

.consume-value {
  color: #ee0a24;
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/components/RecordList.vue
git commit -m "feat: add record list component"
```

---

## Task 8: 图片裁剪组件

**Files:**
- Create: `src/components/ImageCropper.vue`

- [ ] **Step 1: 创建图片裁剪组件 src/components/ImageCropper.vue**

```vue
<template>
  <van-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: '100%' }"
    round
  >
    <div class="cropper-container">
      <van-nav-bar
        title="裁剪图片"
        left-text="取消"
        right-text="确认"
        @click-left="onCancel"
        @click-right="onConfirm"
      />
      <div class="cropper-wrapper">
        <img ref="imageRef" :src="imageSrc" style="max-width: 100%;" />
      </div>
      <div class="cropper-tips">
        请裁剪出需要识别的区域
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const visible = ref(props.show)
const imageRef = ref(null)
let cropper = null

watch(() => props.show, async (val) => {
  visible.value = val
  if (val && props.imageSrc) {
    await nextTick()
    initCropper()
  } else if (!val && cropper) {
    destroyCropper()
  }
})

watch(visible, (val) => {
  emit('update:show', val)
})

const initCropper = () => {
  if (cropper) {
    destroyCropper()
  }
  if (imageRef.value) {
    cropper = new Cropper(imageRef.value, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      restore: false,
      modal: true,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true
    })
  }
}

const destroyCropper = () => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

const onCancel = () => {
  visible.value = false
  emit('cancel')
}

const onConfirm = () => {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 1024,
      maxHeight: 1024,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    const base64 = canvas.toDataURL('image/jpeg', 0.8)
    emit('confirm', base64)
    visible.value = false
  }
}
</script>

<style scoped>
.cropper-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
}

.cropper-wrapper {
  flex: 1;
  overflow: hidden;
}

.cropper-tips {
  padding: 16px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/components/ImageCropper.vue
git commit -m "feat: add image cropper component"
```

---

## Task 9: 库存页面

**Files:**
- Modify: `src/views/Inventory.vue`

- [ ] **Step 1: 实现库存页面 src/views/Inventory.vue**

```vue
<template>
  <div class="page inventory-page">
    <van-nav-bar title="库存">
      <template #right>
        <van-icon name="search" size="18" @click="showSearch = true" />
      </template>
    </van-nav-bar>
    
    <!-- 统计信息 -->
    <van-cell-group inset class="stats-group">
      <van-cell title="总库存" :value="`${inventoryStore.totalQuantity} 颗`" />
      <van-collapse v-model="activeCollapse">
        <van-collapse-item title="色系统计" name="series">
          <div class="series-stats">
            <van-tag 
              v-for="series in colorSeries" 
              :key="series"
              size="medium"
              class="series-tag"
            >
              {{ series }}系: {{ inventoryStore.quantityBySeries[series] || 0 }}
            </van-tag>
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>
    
    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="sortBy" :options="sortOptions" />
        <van-dropdown-item v-model="filterSeries" :options="seriesOptions" />
      </van-dropdown-menu>
    </div>
    
    <!-- 库存列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list class="inventory-list">
        <!-- 告急项 -->
        <template v-if="alertItems.length > 0">
          <van-cell-group inset title="告急" class="alert-group">
            <van-cell
              v-for="item in alertItems"
              :key="item.colorCode"
              :title="item.colorCode"
              :value="item.quantity"
              :class="{ 'alert-item': true }"
              is-link
              @click="onItemClick(item)"
            >
              <template #icon>
                <van-icon name="warning" color="#ee0a24" style="margin-right: 8px;" />
              </template>
            </van-cell>
          </van-cell-group>
        </template>
        
        <!-- 正常项 -->
        <van-cell-group inset title="库存列表">
          <van-cell
            v-for="item in normalItems"
            :key="item.colorCode"
            :title="item.colorCode"
            :value="item.quantity"
            is-link
            @click="onItemClick(item)"
          />
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
    
    <!-- 未初始化提示 -->
    <van-empty
      v-if="!inventoryStore.isInitialized"
      description="请先初始化库存"
    >
      <van-button type="primary" @click="$router.push('/settings')">
        去设置
      </van-button>
    </van-empty>
    
    <!-- 搜索弹窗 -->
    <van-popup v-model:show="showSearch" position="top" round>
      <van-search
        v-model="searchText"
        placeholder="搜索色号"
        show-action
        @cancel="showSearch = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '../stores/inventory'
import { useSettingsStore } from '../stores/settings'
import { colorSeries } from '../data/colors'

const router = useRouter()
const inventoryStore = useInventoryStore()
const settingsStore = useSettingsStore()

const refreshing = ref(false)
const showSearch = ref(false)
const searchText = ref('')
const activeCollapse = ref([])
const sortBy = ref('default')
const filterSeries = ref('all')

const sortOptions = [
  { text: '默认排序', value: 'default' },
  { text: '数量升序', value: 'asc' },
  { text: '数量降序', value: 'desc' },
  { text: '色号排序', value: 'code' }
]

const seriesOptions = [
  { text: '全部', value: 'all' },
  ...colorSeries.map(s => ({ text: `${s}系`, value: s }))
]

// 过滤和排序后的列表
const filteredItems = computed(() => {
  let items = [...inventoryStore.items]
  
  // 搜索过滤
  if (searchText.value) {
    items = items.filter(i => 
      i.colorCode.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  // 色系过滤
  if (filterSeries.value !== 'all') {
    items = items.filter(i => i.colorCode.startsWith(filterSeries.value))
  }
  
  // 排序
  switch (sortBy.value) {
    case 'asc':
      items.sort((a, b) => a.quantity - b.quantity)
      break
    case 'desc':
      items.sort((a, b) => b.quantity - a.quantity)
      break
    case 'code':
      items.sort((a, b) => a.colorCode.localeCompare(b.colorCode))
      break
  }
  
  return items
})

// 告急项
const alertItems = computed(() => {
  return filteredItems.value.filter(
    i => i.quantity < settingsStore.alertThreshold
  )
})

// 正常项
const normalItems = computed(() => {
  return filteredItems.value.filter(
    i => i.quantity >= settingsStore.alertThreshold
  )
})

const onRefresh = () => {
  refreshing.value = false
}

const onItemClick = (item) => {
  router.push(`/add?color=${item.colorCode}`)
}
</script>

<style scoped>
.inventory-page {
  background: #f7f8fa;
}

.stats-group {
  margin: 12px;
}

.series-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.series-tag {
  margin: 0;
}

.filter-bar {
  margin: 12px;
}

.inventory-list {
  min-height: 300px;
}

.alert-group {
  margin-bottom: 12px;
}

.alert-item {
  color: #ee0a24;
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/views/Inventory.vue
git commit -m "feat: implement inventory page with stats, filtering and sorting"
```

---

## Task 10: 入库页面

**Files:**
- Modify: `src/views/AddStock.vue`

- [ ] **Step 1: 实现入库页面 src/views/AddStock.vue**

```vue
<template>
  <div class="page add-stock-page">
    <van-nav-bar title="入库" />
    
    <!-- 手动入库 -->
    <van-cell-group inset title="手动入库">
      <ColorSelect v-model="selectedColor" label="选择色号" />
      <van-field
        v-model="quantity"
        type="number"
        label="数量"
        placeholder="请输入数量"
      >
        <template #button>
          <van-button size="small" type="primary" @click="setQuickQty(500)">500</van-button>
          <van-button size="small" type="primary" @click="setQuickQty(1000)" style="margin-left: 4px;">1000</van-button>
          <van-button size="small" type="primary" @click="setQuickQty(1200)" style="margin-left: 4px;">1200</van-button>
        </template>
      </van-field>
      <div class="action-btn">
        <van-button type="primary" block @click="handleManualAdd" :disabled="!canAdd">
          确认入库
        </van-button>
      </div>
    </van-cell-group>
    
    <!-- 批量入库 -->
    <van-cell-group inset title="批量入库">
      <van-field
        v-model="batchInput"
        rows="3"
        autosize
        type="textarea"
        placeholder="格式：A1 1000, B2 500（每行一个或逗号分隔）"
      />
      <div class="action-btn">
        <van-button type="primary" block @click="handleBatchAdd" :disabled="!batchInput">
          批量入库
        </van-button>
      </div>
    </van-cell-group>
    
    <!-- 最近入库记录 -->
    <van-cell-group inset title="最近入库">
      <RecordList :records="recentAddRecords" />
    </van-cell-group>
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

// 从URL参数获取预选色号
onMounted(() => {
  if (route.query.color) {
    selectedColor.value = route.query.color
  }
})

const canAdd = computed(() => {
  return selectedColor.value && quantity.value && parseInt(quantity.value) > 0
})

const recentAddRecords = computed(() => {
  return recordsStore.addRecords.slice(0, 10)
})

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
  
  // 重置
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
  
  // 重置
  batchInput.value = ''
}
</script>

<style scoped>
.add-stock-page {
  background: #f7f8fa;
  padding-bottom: 16px;
}

.action-btn {
  padding: 16px;
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/views/AddStock.vue
git commit -m "feat: implement add stock page with manual and batch input"
```

---

## Task 11: 消耗页面

**Files:**
- Modify: `src/views/Consume.vue`

- [ ] **Step 1: 实现消耗页面 src/views/Consume.vue**

```vue
<template>
  <div class="page consume-page">
    <van-nav-bar title="消耗" />
    
    <!-- 手动消耗 -->
    <van-cell-group inset title="手动消耗">
      <ColorSelect v-model="selectedColor" label="选择色号" />
      <van-field
        v-model="quantity"
        type="number"
        label="数量"
        placeholder="请输入数量"
      >
        <template #button>
          <van-button size="small" type="primary" @click="setQuickQty(500)">500</van-button>
          <van-button size="small" type="primary" @click="setQuickQty(1000)" style="margin-left: 4px;">1000</van-button>
          <van-button size="small" type="primary" @click="setQuickQty(1200)" style="margin-left: 4px;">1200</van-button>
        </template>
      </van-field>
      <div class="action-btn">
        <van-button type="danger" block @click="handleManualConsume" :disabled="!canConsume">
          确认消耗
        </van-button>
      </div>
    </van-cell-group>
    
    <!-- 批量消耗 -->
    <van-cell-group inset title="批量消耗">
      <van-field
        v-model="batchInput"
        rows="3"
        autosize
        type="textarea"
        placeholder="格式：A1 100, B2 50（每行一个或逗号分隔）"
      />
      <div class="action-btn">
        <van-button type="danger" block @click="handleBatchConsume" :disabled="!batchInput">
          批量消耗
        </van-button>
      </div>
    </van-cell-group>
    
    <!-- AI识别消耗 -->
    <van-cell-group inset title="AI识别">
      <van-button 
        type="primary" 
        block 
        icon="photo-o"
        @click="handleAiRecognize"
      >
        选择图片并识别
      </van-button>
    </van-cell-group>
    
    <!-- AI识别结果 -->
    <van-dialog
      v-model:show="showAiResult"
      title="识别结果"
      show-cancel-button
      @confirm="handleAiConfirm"
    >
      <van-field
        v-model="aiResult"
        rows="4"
        autosize
        type="textarea"
        placeholder="AI识别结果"
      />
    </van-dialog>
    
    <!-- 最近消耗记录 -->
    <van-cell-group inset title="最近消耗">
      <RecordList :records="recentConsumeRecords" />
    </van-cell-group>
    
    <!-- 图片选择 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none;"
      @change="onFileSelected"
    />
    
    <!-- 图片裁剪 -->
    <ImageCropper
      v-model:show="showCropper"
      :image-src="selectedImage"
      @confirm="onCropConfirm"
      @cancel="showCropper = false"
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
import { colorCodes } from '../data/colors'
import { recognizeImage, fileToBase64 } from '../utils/ai'

const inventoryStore = useInventoryStore()
const recordsStore = useRecordsStore()
const settingsStore = useSettingsStore()

const selectedColor = ref('')
const quantity = ref('')
const batchInput = ref('')
const fileInput = ref(null)
const selectedImage = ref('')
const showCropper = ref(false)
const showAiResult = ref(false)
const aiResult = ref('')

const canConsume = computed(() => {
  return selectedColor.value && quantity.value && parseInt(quantity.value) > 0
})

const recentConsumeRecords = computed(() => {
  return recordsStore.consumeRecords.slice(0, 10)
})

const setQuickQty = (qty) => {
  quantity.value = qty.toString()
}

const handleManualConsume = () => {
  const qty = parseInt(quantity.value, 10)
  const currentQty = inventoryStore.getQuantity(selectedColor.value)
  
  if (!selectedColor.value || qty <= 0) {
    showFailToast('请选择色号并输入有效数量')
    return
  }
  
  if (currentQty < qty) {
    showFailToast(`库存不足，当前库存 ${currentQty} 颗`)
    return
  }
  
  inventoryStore.reduceQuantity(selectedColor.value, qty)
  recordsStore.addRecord('consume', selectedColor.value, qty)
  
  showSuccessToast(`成功消耗 ${selectedColor.value} ${qty} 颗`)
  
  // 重置
  quantity.value = ''
}

const handleBatchConsume = () => {
  const items = parseBatchInput(batchInput.value)
  
  if (items.length === 0) {
    showFailToast('未识别到有效的消耗数据')
    return
  }
  
  let successCount = 0
  let failCount = 0
  
  for (const item of items) {
    if (isValidColorCode(item.colorCode, colorCodes)) {
      const currentQty = inventoryStore.getQuantity(item.colorCode)
      if (currentQty >= item.quantity) {
        inventoryStore.reduceQuantity(item.colorCode, item.quantity)
        recordsStore.addRecord('consume', item.colorCode, item.quantity)
        successCount++
      } else {
        failCount++
      }
    } else {
      failCount++
    }
  }
  
  if (failCount > 0) {
    showFailToast(`成功 ${successCount} 项，库存不足或无效 ${failCount} 项`)
  } else {
    showSuccessToast(`成功消耗 ${successCount} 项`)
  }
  
  // 重置
  batchInput.value = ''
}

const handleAiRecognize = () => {
  if (!settingsStore.aiConfig) {
    showFailToast('请先在设置页面配置AI API')
    return
  }
  fileInput.value?.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  const base64 = await fileToBase64(file)
  selectedImage.value = base64
  showCropper.value = true
  
  // 清空input以便再次选择同一文件
  event.target.value = ''
}

const onCropConfirm = async (croppedBase64) => {
  showCropper.value = false
  showLoadingToast({
    message: 'AI识别中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const result = await recognizeImage(croppedBase64, settingsStore.aiConfig)
    aiResult.value = result
    showAiResult.value = true
  } catch (error) {
    showFailToast(error.message || 'AI识别失败')
  } finally {
    closeToast()
  }
}

const handleAiConfirm = () => {
  const items = parseBatchInput(aiResult.value)
  
  if (items.length === 0) {
    showFailToast('未识别到有效的消耗数据')
    return
  }
  
  let successCount = 0
  let failCount = 0
  
  for (const item of items) {
    if (isValidColorCode(item.colorCode, colorCodes)) {
      const currentQty = inventoryStore.getQuantity(item.colorCode)
      if (currentQty >= item.quantity) {
        inventoryStore.reduceQuantity(item.colorCode, item.quantity)
        recordsStore.addRecord('consume', item.colorCode, item.quantity, 'AI识别')
        successCount++
      } else {
        failCount++
      }
    } else {
      failCount++
    }
  }
  
  if (failCount > 0) {
    showFailToast(`成功 ${successCount} 项，库存不足或无效 ${failCount} 项`)
  } else {
    showSuccessToast(`AI识别消耗成功 ${successCount} 项`)
  }
  
  aiResult.value = ''
}
</script>

<style scoped>
.consume-page {
  background: #f7f8fa;
  padding-bottom: 16px;
}

.action-btn {
  padding: 16px;
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/views/Consume.vue
git commit -m "feat: implement consume page with manual, batch and AI recognition"
```

---

## Task 12: 设置页面

**Files:**
- Modify: `src/views/Settings.vue`

- [ ] **Step 1: 实现设置页面 src/views/Settings.vue**

```vue
<template>
  <div class="page settings-page">
    <van-nav-bar title="设置" />
    
    <!-- 库存初始化 -->
    <van-cell-group inset title="库存初始化">
      <van-field
        v-model="defaultQuantity"
        type="number"
        label="默认数量"
        placeholder="每个色号的默认数量"
      />
      <van-button 
        type="primary" 
        block 
        @click="handleInitInventory"
        style="margin: 16px;"
      >
        一键初始化221色
      </van-button>
    </van-cell-group>
    
    <!-- 告急设置 -->
    <van-cell-group inset title="告急设置">
      <van-field
        v-model="alertThreshold"
        type="number"
        label="告急阈值"
        placeholder="库存低于此数量时告急"
      >
        <template #button>
          <van-button size="small" type="primary" @click="saveAlertThreshold">
            保存
          </van-button>
        </template>
      </van-field>
    </van-cell-group>
    
    <!-- AI配置 -->
    <van-cell-group inset title="AI配置">
      <van-field
        v-model="aiApiUrl"
        label="API地址"
        placeholder="如: https://api.openai.com/v1/chat/completions"
      />
      <van-field
        v-model="aiApiKey"
        label="API Key"
        placeholder="请输入API密钥"
        type="password"
      />
      <van-field
        v-model="aiModelName"
        label="模型名称"
        placeholder="如: gpt-4o"
      />
      <van-button 
        type="primary" 
        block 
        @click="saveAiConfig"
        style="margin: 16px;"
      >
        保存AI配置
      </van-button>
    </van-cell-group>
    
    <!-- 操作记录 -->
    <van-cell-group inset title="操作记录">
      <van-cell 
        title="查看全部记录" 
        is-link 
        @click="showRecordsPopup = true"
      />
    </van-cell-group>
    
    <!-- 数据管理 -->
    <van-cell-group inset title="数据管理">
      <van-cell title="导出数据" is-link @click="handleExport" />
      <van-cell title="清空数据" is-link @click="handleClearData" />
    </van-cell-group>
    
    <!-- 全部记录弹窗 -->
    <van-popup
      v-model:show="showRecordsPopup"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <van-nav-bar title="操作记录">
        <template #right>
          <van-icon name="cross" @click="showRecordsPopup = false" />
        </template>
      </van-nav-bar>
      <RecordList :records="allRecords" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant'
import RecordList from '../components/RecordList.vue'
import { useInventoryStore } from '../stores/inventory'
import { useRecordsStore } from '../stores/records'
import { useSettingsStore } from '../stores/settings'
import { exportAllData, clearAllStorage } from '../utils/storage'

const inventoryStore = useInventoryStore()
const recordsStore = useRecordsStore()
const settingsStore = useSettingsStore()

const defaultQuantity = ref('1000')
const alertThreshold = ref(settingsStore.alertThreshold.toString())
const aiApiUrl = ref(settingsStore.aiConfig?.apiUrl || '')
const aiApiKey = ref(settingsStore.aiConfig?.apiKey || '')
const aiModelName = ref(settingsStore.aiConfig?.modelName || '')
const showRecordsPopup = ref(false)

const allRecords = computed(() => recordsStore.records)

const handleInitInventory = async () => {
  try {
    await showConfirmDialog({
      title: '确认初始化',
      message: '这将清空当前库存并重新初始化，确定继续吗？'
    })
    
    const qty = parseInt(defaultQuantity.value, 10) || 1000
    inventoryStore.initInventory(qty)
    
    showSuccessToast(`成功初始化221色，每个${qty}颗`)
  } catch {
    // 用户取消
  }
}

const saveAlertThreshold = () => {
  const threshold = parseInt(alertThreshold.value, 10)
  if (threshold <= 0) {
    showFailToast('请输入有效的告急阈值')
    return
  }
  settingsStore.alertThreshold = threshold
  settingsStore.saveSettings()
  showSuccessToast('保存成功')
}

const saveAiConfig = () => {
  if (!aiApiUrl.value || !aiApiKey.value || !aiModelName.value) {
    showFailToast('请填写完整的AI配置')
    return
  }
  
  settingsStore.saveAiConfig({
    apiUrl: aiApiUrl.value,
    apiKey: aiApiKey.value,
    modelName: aiModelName.value
  })
  
  showSuccessToast('AI配置保存成功')
}

const handleExport = () => {
  const data = exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `pindou-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  
  URL.revokeObjectURL(url)
  showSuccessToast('导出成功')
}

const handleClearData = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '这将清空所有数据，此操作不可恢复，确定继续吗？'
    })
    
    clearAllStorage()
    inventoryStore.clearInventory()
    recordsStore.clearRecords()
    settingsStore.loadFromStorage()
    
    showSuccessToast('数据已清空')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.settings-page {
  background: #f7f8fa;
  padding-bottom: 16px;
}
</style>
```

- [ ] **Step 2: 提交代码**

```bash
git add src/views/Settings.vue
git commit -m "feat: implement settings page with init, AI config and data management"
```

---

## Task 13: 最终测试与构建

**Files:**
- Modify: `package.json`
- Create: `public/pwa-192x192.png` (占位)

- [ ] **Step 1: 创建PWA图标占位 public/pwa-192x192.png**

创建一个简单的SVG图标或使用在线工具生成。

- [ ] **Step 2: 添加 .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
```

- [ ] **Step 3: 运行开发服务器测试**

```bash
npm run dev
```
Expected: 应用启动成功，所有功能正常

- [ ] **Step 4: 构建生产版本**

```bash
npm run build
```
Expected: 构建成功，生成 dist 目录

- [ ] **Step 5: 预览生产版本**

```bash
npm run preview
```
Expected: 生产版本可以正常运行

- [ ] **Step 6: 最终提交**

```bash
git add .
git commit -m "feat: complete AI拼豆 inventory management PWA"
```

---

## 实现检查清单

| 功能 | 状态 |
|------|------|
| 初始化库存 (221色) | [ ] |
| 手动入库 | [ ] |
| 批量入库 | [ ] |
| 手动消耗 | [ ] |
| 批量消耗 | [ ] |
| AI识别消耗 | [ ] |
| 库存列表显示 | [ ] |
| 告急提醒 | [ ] |
| 排序功能 | [ ] |
| 筛选功能 | [ ] |
| 搜索功能 | [ ] |
| 色系统计 | [ ] |
| 操作记录 | [ ] |
| AI配置 | [ ] |
| 数据导出 | [ ] |
| 数据清空 | [ ] |
| PWA支持 | [ ] |
