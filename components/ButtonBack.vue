<template>
  <div class="text-gray-600"><a
      href=""
      @click.prevent="$router.back()"
    >
      <div class="flex gap-1 items-center">
        <Icon
          class="self-center"
          name="ph:arrow-left-bold"
          size="20"
        />
        <div class="self-center mt-[2px] ml-[2px] text-sm font-bold">{{ $t('go_back').toUpperCase() }}</div>
      </div>
    </a></div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>