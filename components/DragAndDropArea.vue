<template>
  <div
    class="flex"
    @dragover.prevent
    @drop.prevent
  >
    <label
      for="dropzone-file"
      class="flex flex-col gap-1 items-center justify-center px-12 bg-stone-200/50 w-full border-2 border-stone-400/70 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-stone-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 rounded-lg py-12"
      @drop="event => emit('onDrop', event)"
    >
      <div class="mb-2 text-stone-400">
        <Icon
          name="lucide:upload-cloud"
          size="55"
          aria-hidden="true"
        />
      </div>
      <p class="text-sm text-stone-700"><span class="font-semibold">{{ title }}</span></p>
      <p class="text-sm text-stone-700">{{ subtitle }}</p>
      <input
        id="dropzone-file"
        type="file"
        name="fff"
        class="hidden"
        @change="event => emit('onChange', event)"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
const { title, subtitle } = defineProps<{
  title: string;
  subtitle: string;
}>();
const emit = defineEmits(["onDrop", "onChange"]);
</script>

<style>
</style>