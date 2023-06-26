<template>
  <div class="text-gray-600"><a
      href=""
      @click.prevent="$router.back()"
    >
      <div class="flex gap-2 items-center">
        <Icon
          class=""
          name="ph:arrow-left-bold"
          size="22"
        />
        <div class="mt-[2px] text-sm font-bold">{{ $t('go_back').toUpperCase() }}</div>
      </div>
    </a></div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>