<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="px-5 py-2 btn btn-lg btn-ghost btn-block sm:w-fit h-fit gap-2 sm:justify-start justify-center items-center rounded-md text-xl !font-bold text-stone-500 bg-white shadow-md hover:bg-stone-100"
      :class="(selectedOption && extractId(selectedOption) === extractId(option) ? 'border-4 border-primary btn-disabled ' : '` border-4 border-transparent ') + (fullWidth ? 'btn-block ' : ' ') + (enableUnselectedBorder ? ' ' : 'border-none ')"
      v-for="option in options"
      :key="extractId(option)"
      @click="onItemClicked(option)"
    >
      <div v-if="!extractIconName">
        <Icon
          v-if="selectedOption && extractId(selectedOption) === extractId(option)"
          class="mb-0.5 text-primary"
          name="ph:radio-button-fill"
          size="20"
        />
        <Icon
          v-else
          class="mb-0.5 text-stone-400"
          name="ph:circle"
          size="20"
        />
      </div>
      <div v-else>
        <Icon
          v-if="selectedOption && extractId(selectedOption) === extractId(option)"
          class="mb-0.5 text-primary"
          :name="extractIconName(option)"
          size="25"
        />
        <Icon
          v-else
          class="mb-0.5 text-stone-400"
          :name="extractIconName(option)"
          size="25"
        />
      </div>
      <div class="flex flex-col items-start ml-1">
        <div :class="selectedOption && extractId(selectedOption) === extractId(option) ? 'text-stone-600' : 'text-stone-400'">
          {{ extractTitle(option) }}
        </div>
        <div
          v-if="extractDescription"
          class="font-normal text-sm"
        >
          {{ extractDescription(option) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  options,
  preselectOption,
  extractId,
  extractTitle,
  extractDescription,
  extractIconName,
  fullWidth,
  enableUnselectedBorder,
} = defineProps<{
  options: any[];
  preselectOption?: any;
  extractId: Function;
  extractTitle: Function;
  extractDescription?: Function;
  extractIconName?: Function;
  fullWidth?: boolean;
  enableUnselectedBorder?: boolean;
}>();

const emit = defineEmits(["onSelectionChange"]);

const selectedOption = ref(
  preselectOption !== null ? preselectOption : (null as any | null)
);

function onItemClicked(option: any) {
  if (!selectedOption || extractId(selectedOption) !== extractId(option)) {
    selectedOption.value = option;
  } else {
    selectedOption.value = null;
  }

  emit("onSelectionChange", selectedOption.value);
}
</script>

<style>
</style>