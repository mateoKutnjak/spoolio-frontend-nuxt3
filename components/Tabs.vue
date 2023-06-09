<template>
  <div class="flex gap-1 justify-center w-min">
    <div
      v-for="tab, index in tabs"
      :key="tab.title"
      class="w-max py-3 px-4 cursor-pointer border-0 font-semibold hover:border-b-2 flex items-center gap-2"
      :class="selected === index ? 'border-b-2 border-primary text-primary' : 'text-stone-600 hover:border-stone-300 hover:text-stone-600'"
      @click="onTabClicked(index)"
    >
      <Icon
        v-if="tab.iconName"
        :name="tab.iconName"
      />
      <div class="line-clamp-1">{{ tab.title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ITab } from "~~/constants/data";

const { tabs, selectedTabIndex } = defineProps<{
  tabs: ITab[];
  selectedTabIndex?: number;
}>();

const emit = defineEmits(["onTabClicked"]);

const selected = ref(selectedTabIndex);

function onTabClicked(index: number) {
  selected.value = index;
  emit("onTabClicked", index);
}
</script>

<style>
</style>