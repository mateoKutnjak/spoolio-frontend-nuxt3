<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="tab, index in tabs"
      :key="tab.title"
      class="btn !font-medium btn-sm"
      :class="selected === index ? 'btn-primary' : 'btn-ghost'"
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