<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="px-5 btn btn-lg btn-ghost gap-2 items-center rounded-md text-base !font-bold text-stone-500"
      :class="selectedOption && extractId(selectedOption) === extractId(option) ? 'border-4 border-primary btn-disabled' : 'border-stone-400 hover:border-stone-400'"
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
      <div class="flex flex-col">
        <div :class="selectedOption && extractId(selectedOption) === extractId(option) ? 'text-stonr-700' : 'text-stone-400'">
          {{ extractTitle(option) }}
        </div>
        <div v-if="extractDescription">
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
} = defineProps<{
  options: any[];
  preselectOption?: any;
  extractId: Function;
  extractTitle: Function;
  extractDescription?: Function;
  extractIconName?: Function;
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