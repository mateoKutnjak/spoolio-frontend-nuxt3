<template>
  <div class="pt-16 flex flex-col justify-center items-center">
    <Icon
      name="octicon:telescope"
      size="230"
    />
    <div class="mt-8 font-sans text-stone-500 text-xl">{{ capitalizeOnlyFirstLetter($t('nothing_to_show')) }}</div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>