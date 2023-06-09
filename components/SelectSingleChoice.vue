<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="btn btn-sm gap-1"
      :class="selectedOption && extractId(selectedOption) === extractId(option) ? 'btn-success text-white' : 'btn-outline'"
      v-for="option in options"
      :key="extractId(option)"
      @click="onItemClicked(option)"
    >
      <Icon
        v-if="selectedOption && extractId(selectedOption) === extractId(option)"
        name="lucide:check"
        size="20"
      />
      {{ extractTitle(option) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const { options, preselectOption, extractId, extractTitle } = defineProps<{
  options: any[];
  preselectOption?: any;
  extractId: Function;
  extractTitle: Function;
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