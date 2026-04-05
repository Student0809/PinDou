<template>
  <div class="record-list">
    <template v-if="records.length > 0">
      <div v-for="record in records" :key="record.id" class="record-card" :class="record.type">
        <div class="record-left">
          <span class="record-icon">{{ record.type === 'consume' ? '-' : '+' }}</span>
          <div>
            <div class="record-code">{{ record.colorCode }}</div>
            <div class="record-time">{{ formatTime(record.timestamp) }}</div>
          </div>
        </div>
        <div class="record-value">{{ formatValue(record) }}</div>
      </div>
    </template>
    <van-empty v-else description="暂无记录" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
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
  margin-top: 6px;
}

.record-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  background: #fff9ec;
  border: 1px solid rgba(194, 147, 67, 0.2);
}

.record-card.consume {
  background: #fff3ef;
  border-color: rgba(217, 74, 52, 0.25);
}

.record-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.record-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  background: #2e8f5b;
}

.record-card.consume .record-icon {
  background: #d94a34;
}

.record-code {
  font-weight: 700;
}

.record-time {
  margin-top: 2px;
  font-size: 12px;
  color: var(--pd-muted);
}

.record-value {
  font-size: 18px;
  font-weight: 700;
  color: #2e8f5b;
}

.record-card.consume .record-value {
  color: #d94a34;
}
</style>
