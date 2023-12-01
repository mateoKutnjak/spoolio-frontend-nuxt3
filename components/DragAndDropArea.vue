<template>
  <div class="h-full flex flex-col">
    <div
      class="relative h-full min-h-[220px] max-h-[350px] flex flex-col items-center justify-center bg-base-100 w-full border-4 border-primary border-dashed rounded-lg"
      @dragover.prevent
      @drop.prevent
    >
      <label
        for="dropzone-file"
        class="flex flex-col h-full w-full items-center justify-center px-5 pb-14 pt-8 cursor-pointer hover:bg-stone-200/20"
        @drop="event => emit('onDrop', event)"
      >
        <Icon
          class="mb-5 text-primary"
          name="material-symbols:upload-file-outline"
          size="65"
          aria-hidden="true"
        />        
        <div class="text-3xl font-bold text-center mb-1">{{ title }}</div>
        <p class="text-lg text-gray-400 font-bold">{{ subtitle }}</p>

        <input
          id="dropzone-file"
          type="file"
          name="fff"
          class="hidden"
          @change="event => emit('onChange', event)"
        />
      </label>

      <div class="absolute right-0 bottom-0 pr-8 pb-4">
        <Dropdown
          class="w-[100px] h-full"
          :items="dimensionUnits"
          :preselected-item="dimensionUnits[0]"
          :extract-name="a => a"
          size="sm"
          background-color="bg-white"
          @on-item-clicked="event => emit('onUnitChange', event)"
        />
      </div>
    </div>
    <div
      v-if="hidePrivacyLabel"
      class="self-end flex text-sm text-gray-500 mt-2"
    >
      <Icon
        class="mr-1"
        name="ic:outline-lock"
        size="18"
      />
      <div class="font-bold mr-1">{{ capitalizeOnlyFirstLetter($t('privacy')) }}:</div>
      {{ capitalizeOnlyFirstLetter($t('all_files_are_encrypted')) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const { title, subtitle, hidePrivacyLabel } = defineProps<{
  title: string;
  subtitle: string;
  hidePrivacyLabel?: boolean;
}>();
const emit = defineEmits(["onDrop", "onChange", "onUnitChange"]);

const dimensionUnits: string[] = Object.keys(DimensionUnit).filter((item) => {
  return isNaN(Number(item));
});

</script>

<style>
</style>