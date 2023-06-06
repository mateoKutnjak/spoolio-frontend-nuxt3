<template>
  <NuxtLink
    class="text-primary"
    :to="to"
  >
    <div class="flex gap-2">

      <div class="text-lg font-bold">{{ capitalizeOnlyFirstLetter($t('find_out_more')) }}</div>
      <Icon
        class="mt-[1px]"
        name="lucide:arrow-right"
        size="24"
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