<template>
  <div class="app-shell">
    <router-view />

    <van-tabbar route fixed safe-area-inset-bottom class="app-tabbar">
      <van-tabbar-item to="/inventory" icon="apps-o">库存</van-tabbar-item>
      <van-tabbar-item to="/add" icon="plus">入库</van-tabbar-item>
      <van-tabbar-item to="/consume" icon="minus">消耗</van-tabbar-item>
      <van-tabbar-item to="/settings" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding-bottom: 68px;
  background:
    radial-gradient(circle at 85% -5%, #ffe4b8 0%, #fff7e8 32%, transparent 48%),
    linear-gradient(180deg, #fffdf7 0%, #fef3dc 100%);
}

.app-tabbar {
  box-shadow: 0 -6px 20px rgba(190, 138, 52, 0.16);
}

:deep(.van-tabbar-item--active) {
  font-weight: 600;
}
</style>
