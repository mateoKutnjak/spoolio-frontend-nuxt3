<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="px-5 btn btn-lg btn-ghost gap-2 items-center rounded-md text-base !font-bold "
      :class="selectedOptions.findIndex((el) => extractId(el) === extractId(option)) > -1 ? 'text-stone-500 border-4 border-primary hover:border-4 hover:border-primary' : 'text-stone-400 border-stone-400 hover:border-stone-400'"
      v-for="option in options"
      :key="extractId(option)"
      @click="onItemClicked(option)"
    >

      <Icon
        v-if="selectedOptions.findIndex((el) => extractId(el) === extractId(option)) > -1 "
        class="mb-0.5 text-primary"
        name="ph:check-square-fill"
        size="20"
      />
      <Icon
        v-else
        class="mb-0.5 text-stone-400"
        name="ph:square"
        size="20"
      />

      <div class="flex flex-col items-start">
        <div>
          {{ extractTitle(option) }}
        </div>
        <div
          v-if="extractDescription"
          class="text-xs text-stone-400 font-normal"
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
  preselectOptions,
  extractId,
  extractTitle,
  extractDescription,
} = defineProps<{
  options: any[];
  preselectOptions?: any[];
  extractId: Function;
  extractTitle: Function;
  extractDescription?: Function;
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