<template>
  <div class="border border-stone-300 flex flex-col justify-center items-center text-stone-400">
    <Icon
      name="lucide:image"
      size="40"
    />
    <div class="font-sans text-sm">{{ capitalizeOnlyFirstLetter($t('image_not_found')) }}</div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>