<template>
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="btn btn-circle btn-ghost btn-sm text-error"
    >
      <Icon
        name="material-symbols:warning-rounded"
        size="18"
      />
    </label>
    <div
      tabindex="0"
      class="card compact dropdown-content shadow-md bg-base-100 rounded-box border"
    >
      <div class="card-body">
        <div class="flex flex-row gap-2 items-center">
          <Icon
            class="text-error"
            size="20"
            name="material-symbols:warning-rounded"
          />
          <p class="font-light text-base">{{ dropdownMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { dropdownMessage } = defineProps(["dropdownMessage"]);
</script>

<style>
</style>