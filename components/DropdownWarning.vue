<template>
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="flex gap-2 btn btn-ghost btn-sm"
    >

      <Icon
        class="text-error"
        name="material-symbols:warning-rounded"
        size="18"
      />
      <div class="text-lg font-medium text-gray-700 ">
        {{ text }}
      </div>
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
const { dropdownMessage, text } = defineProps(["dropdownMessage", "text"]);
</script>

<style>
</style>