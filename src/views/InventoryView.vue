<template>
  <div class="page inventory-page">
    <van-nav-bar title="库存总览" class="top-nav" />

    <template v-if="inventoryStore.isInitialized">
      <div class="mobile-card hero-card">
        <div class="hero-content">
          <div>
            <div class="hero-label">总库存</div>
            <div class="hero-value">{{ inventoryStore.totalQuantity }} <span>颗</span></div>
          </div>
          <div class="hero-alert">
            <div>告急色号</div>
            <strong>{{ alertItems.length }}</strong>
          </div>
        </div>

        <div class="series-grid">
          <div v-for="series in colorSeries" :key="series" class="series-item">
            <span>{{ series }}系</span>
            <strong>{{ inventoryStore.quantityBySeries[series] || 0 }}</strong>
          </div>
        </div>
      </div>

      <div class="mobile-card">
        <div class="card-header">筛选与排序</div>
        <div class="card-body">
          <van-search v-model="searchText" placeholder="搜索色号，如 A1" shape="round" />
          <van-dropdown-menu class="filter-menu">
            <van-dropdown-item v-model="sortBy" :options="sortOptions" />
            <van-dropdown-item v-model="filterSeries" :options="seriesOptions" />
          </van-dropdown-menu>
        </div>
      </div>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="mobile-card inventory-result">
          <div class="card-header">库存清单</div>
          <div class="card-body list-body">
            <div v-if="filteredItems.length === 0" class="empty-state">没有匹配到任何色号</div>

            <template v-else>
              <div class="stock-table">
                <div class="stock-table-head">
                  <span>色号</span>
                  <span>状态</span>
                  <span class="qty-col">库存(颗)</span>
                </div>

                <div class="stock-table-body">
                  <div
                    v-for="item in sortedWithAlerts"
                    :key="item.colorCode"
                    class="stock-row"
                    :class="{ danger: item.quantity < settingsStore.alertThreshold }"
                    @click="onItemClick(item)"
                  >
                    <span class="stock-code">{{ item.colorCode }}</span>
                    <span class="stock-tag">{{ item.quantity < settingsStore.alertThreshold ? '告急补货' : '库存正常' }}</span>
                    <span class="stock-right">{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </van-pull-refresh>
    </template>

    <div v-else class="mobile-card init-card">
      <div class="card-header">还没有库存数据</div>
      <div class="card-body">
        <p>先去设置页面一键初始化 221 色库存，之后就可以开始入库和消耗了。</p>
        <van-button class="init-action-btn" type="primary" block round icon="setting-o" @click="$router.push('/settings')">
          立即初始化
        </van-button>
      </div>
    </div>
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
const searchText = ref('')
const sortBy = ref('default')
const filterSeries = ref('all')

const sortOptions = [
  { text: '默认排序', value: 'default' },
  { text: '数量升序', value: 'asc' },
  { text: '数量降序', value: 'desc' },
  { text: '色号排序', value: 'code' }
]

const seriesOptions = [
  { text: '全部色系', value: 'all' },
  ...colorSeries.map((s) => ({ text: `${s}系`, value: s }))
]

const filteredItems = computed(() => {
  let items = [...inventoryStore.items]

  if (searchText.value) {
    items = items.filter((item) => item.colorCode.toLowerCase().includes(searchText.value.toLowerCase()))
  }

  if (filterSeries.value !== 'all') {
    items = items.filter((item) => item.colorCode.startsWith(filterSeries.value))
  }

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
    default:
      break
  }

  return items
})

const alertItems = computed(() => filteredItems.value.filter((i) => i.quantity < settingsStore.alertThreshold))

const sortedWithAlerts = computed(() => {
  const alerts = filteredItems.value.filter((i) => i.quantity < settingsStore.alertThreshold)
  const normal = filteredItems.value.filter((i) => i.quantity >= settingsStore.alertThreshold)
  return [...alerts, ...normal]
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
  background: transparent;
}

.top-nav {
  background: transparent;
}

.hero-card {
  margin-top: 8px;
  background: linear-gradient(160deg, #f8a62f 0%, #d98617 100%);
  color: #fff;
}

.hero-content {
  padding: 18px 16px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.hero-label {
  opacity: 0.9;
  font-size: 13px;
}

.hero-value {
  margin-top: 4px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.hero-value span {
  font-size: 14px;
  margin-left: 3px;
  font-weight: 500;
}

.hero-alert {
  text-align: right;
  font-size: 12px;
}

.hero-alert strong {
  display: block;
  margin-top: 4px;
  font-size: 24px;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0 12px 14px;
}

.series-item {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.24);
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.series-item strong {
  font-size: 13px;
}

.filter-menu {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
}

.list-body {
  padding-top: 4px;
}

.stock-table {
  border-radius: 12px;
  border: 1px solid rgba(206, 160, 88, 0.2);
  overflow: hidden;
}

.stock-table-head {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 8px;
  padding: 10px 12px;
  background: #f8e8c7;
  color: #6f4a15;
  font-size: 12px;
  font-weight: 700;
}

.stock-table-body {
  max-height: 52vh;
  overflow-y: auto;
  background: #fffdf8;
}

.stock-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 8px;
  align-items: center;
  padding: 11px 12px;
  border-bottom: 1px solid rgba(206, 160, 88, 0.15);
  background: var(--pd-surface-soft);
}

.stock-row:last-child {
  border-bottom: 0;
}

.stock-row.danger {
  background: #ffece6;
}

.stock-code {
  font-size: 15px;
  font-weight: 700;
}

.stock-tag {
  color: var(--pd-muted);
  font-size: 12px;
}

.stock-row.danger .stock-tag {
  color: #bb3b29;
}

.stock-right {
  text-align: right;
  font-size: 18px;
  font-weight: 700;
  color: #7f5413;
}

.stock-row.danger .stock-right {
  color: #bb3b29;
}

.qty-col {
  text-align: right;
}

.empty-state {
  text-align: center;
  color: var(--pd-muted);
  padding: 20px 0 12px;
}

.init-card p {
  color: var(--pd-muted);
  margin-bottom: 12px;
  line-height: 1.5;
}

.init-action-btn {
  height: 44px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 8px 18px rgba(210, 140, 32, 0.28);
}
</style>
