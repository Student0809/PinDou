<template>
  <van-field
    v-model="displayValue"
    is-link
    readonly
    :label="label"
    :placeholder="placeholder"
    class="color-select-field"
    @click="showPicker = true"
  />

  <van-popup v-model:show="showPicker" position="bottom" round :style="{ height: '72vh' }">
    <div class="picker-panel">
      <div class="toolbar-row">
        <van-search v-model="searchText" placeholder="搜索色号" class="picker-search" />
        <van-button type="primary" size="small" round class="confirm-btn" @click="onConfirmSelect">
          确认
        </van-button>
      </div>

      <van-tabs v-model:active="activeTab" swipeable>
        <van-tab title="全部" name="ALL" />
        <van-tab v-for="series in colorSeries" :key="series" :title="`${series}系`" :name="series" />
      </van-tabs>

      <div class="color-grid">
        <van-button
          v-for="code in filteredCodes"
          :key="code"
          size="small"
          round
          :type="tempValue === code ? 'primary' : 'default'"
          class="code-item"
          @click="tempValue = code"
        >
          {{ code }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { colorCodes, colorSeries } from '../data/colors'

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
const tempValue = ref(props.modelValue)
const activeTab = ref('ALL')

watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = val
    tempValue.value = val
  }
)

watch(showPicker, (visible) => {
  if (visible) {
    tempValue.value = displayValue.value
  } else {
    searchText.value = ''
    activeTab.value = 'ALL'
  }
})

const filteredCodes = computed(() => {
  let codes = colorCodes

  if (activeTab.value !== 'ALL') {
    codes = codes.filter((c) => c.startsWith(activeTab.value))
  }

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    codes = codes.filter((c) => c.toLowerCase().includes(keyword))
  }

  return codes
})

const onConfirmSelect = () => {
  if (!tempValue.value) {
    return
  }
  displayValue.value = tempValue.value
  emit('update:modelValue', tempValue.value)
  showPicker.value = false
}
</script>

<style scoped>
.color-select-field {
  margin-bottom: 6px;
}

.picker-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff9ec;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.picker-search {
  flex: 1;
  padding: 0;
}

.confirm-btn {
  min-width: 64px;
}

.color-grid {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.code-item {
  width: 100%;
}
</style>
