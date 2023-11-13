<template>
  <svg
    class="icon"
    aria-hidden="true"
  >
    <use
      :xlink:href="`#icon-${name}`"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>