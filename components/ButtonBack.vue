<template>
  <div class="text-gray-600"><a
      href=""
      @click.prevent="$router.back()"
    >
      <div class="flex gap-2">
        <Icon
          class="mt-[1px]"
          name="lucide:arrow-left"
          size="24"
        />
        <div class="text-lg font-bold">{{ capitalizeOnlyFirstLetter($t('go_back')) }}</div>
      </div>
    </a></div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>