<template>
  <div class="demo">
    <Icon name="community" />
    <Icon name="support" />
    <Icon name="tooling" />
  </div>
</template>

<script setup lang="ts">
import Icon from './components/Icon.vue'
</script>

<style scoped>
.demo {
  display: flex;
  gap: 12px;
}
</style>
