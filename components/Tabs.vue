<template>
  <div class="flex flex-wrap gap-1 justify-center">
    <div
      v-for="tab, index in tabs"
      :key="tab.title"
      class="w-max py-3 px-4 cursor-pointer border-0 font-semibold hover:border-b-2 flex items-center gap-2"
      :class="selected === index ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-600'"
      @click="onTabClick(tab)"
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

function onTabClick(tab: ITab) {
  selected.value = tabs.findIndex((el) => el.title === tab.title);
  emit("onTabClicked", tab);
}
</script>

<style>
</style>