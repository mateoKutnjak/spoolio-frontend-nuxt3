<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="btn btn-sm gap-1"
      :class="selectedOptions.findIndex((el) => extractId(el) === extractId(option)) > -1 ? 'btn-success text-white' : 'btn-outline'"
      v-for="option in options"
      :key="extractId(option)"
      @click="onItemClicked(option)"
    >
      <Icon
        v-if="selectedOptions.findIndex((el) => extractId(el) === extractId(option)) > -1 "
        name="lucide:check"
        size="20"
      />
      {{ extractTitle(option) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const { options, preselectOptions, extractId, extractTitle } = defineProps<{
  options: any[];
  preselectOptions?: any[];
  extractId: Function;
  extractTitle: Function;
}>();

const emit = defineEmits(["onSelectionChange"]);

const selectedOptions = ref<any[]>(
  preselectOptions ? preselectOptions : ([] as any[])
);

function onItemClicked(option: any) {
  const index = selectedOptions.value.findIndex(
    (el) => extractId(el) === extractId(option)
  );

  if (index === -1) {
    selectedOptions.value.push(option);
  } else {
    selectedOptions.value = selectedOptions.value.filter(
      (el) => extractId(el) !== extractId(option)
    );
  }

  emit("onSelectionChange", selectedOptions.value);
}
</script>

<style>
</style>