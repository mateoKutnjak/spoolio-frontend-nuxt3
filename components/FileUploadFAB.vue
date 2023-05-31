<template>
  <div
    class="tooltip tooltip-left"
    :data-tip="capitalizeOnlyFirstLetter($t('upload_3d_model'))"
  >
    <label
      for="dropzone-file"
      class="btn btn-circle btn-ghost btn-lg bg-base-100 shadow-md"
    >
      <Icon
        class="text-gray-500"
        name="lucide:upload-cloud"
        size="30"
        aria-hidden="true"
      />
      <input
        id="dropzone-file"
        type="file"
        name="fff"
        class="hidden"
        @change="event => emit('change', event)"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["change"]);
</script>

<style>
</style>