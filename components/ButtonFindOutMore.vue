<template>
  <NuxtLink
    class="text-primary"
    :to="localePath('to')"
  >
    <div class="flex gap-2">

      <div class="text-lg font-bold">{{ capitalizeOnlyFirstLetter($t('find_out_more')) }}</div>
      <Icon
        class="mt-[3px]"
        name="ph:arrow-right-bold"
        size="22"
      />
    </div>
  </NuxtLink>
</template>
  
  <script lang="ts" setup>
const { to } = defineProps<{
  to: string;
}>();
</script>
  
  <style>
</style>