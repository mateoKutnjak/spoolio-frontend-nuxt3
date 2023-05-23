<template>
  <div
    class="btn btn-sm text-info rounded-full bg-stone-200 !rounded-full"
    :class="selected ? 'border-2 border-info' : ' btn-ghost'"
    @click.prevent="emit('onTagClicked', tag)"
  >{{ tag.name }}</div>
</template>

<script lang="ts" setup>
import { IBlogTag } from "~~/constants/data";

const { tag, selected } = defineProps<{
  tag: IBlogTag;
  selected: boolean;
}>();

const emit = defineEmits(["onTagClicked"]);
</script>

<style>
</style>