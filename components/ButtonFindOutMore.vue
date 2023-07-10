<template>
  <NuxtLink
    class="btn btn-ghost text-primary"
    :to="localePath(to)"
  >
    <div class="flex gap-2 items-center">

      <div class="mb-[1px]">{{ capitalizeOnlyFirstLetter($t('find_out_more')) }}</div>
      <Icon
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