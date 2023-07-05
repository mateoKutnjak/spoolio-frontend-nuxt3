<template>
  <div
    class="btn btn-xs btn-outline text-stone-600 !rounded-full"
    @click.prevent="emit('onTagClicked', tag)"
  >{{ capitalizeOnlyFirstLetter($t(tag.name)) }}</div>
</template>

<script lang="ts" setup>
import { IBlogTag } from "~~/constants/data";

const { tag } = defineProps<{
  tag: IBlogTag;
}>();

const emit = defineEmits(["onTagClicked"]);
</script>

<style>
</style>