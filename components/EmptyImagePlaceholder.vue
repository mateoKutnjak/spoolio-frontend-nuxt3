<template>
  <div class="border border-stone-300 flex flex-col gap-2 justify-center items-center text-stone-500">
    <Icon
      name="octicon:telescope"
      size="50"
    />
    <div class="font-sans text-sm">{{ capitalizeOnlyFirstLetter($t('image_not_found')) }}</div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>