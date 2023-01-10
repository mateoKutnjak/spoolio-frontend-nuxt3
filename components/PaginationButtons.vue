<template>
  <div>
    <div class="btn-group grid grid-flow-col auto-cols-max bg-white rounded-xl shadow border border-gray-300">
      <button
        v-if="currentPage-2 >= 0"
        class="btn btn-ghost"
        @click="$emit('onPageSelected', 0)"
      >1</button>
      <button
        v-if="currentPage-3 >= 0"
        class="btn btn-ghost btn-disabled bg-gray-200 text-gray-500"
      >...</button>
      <button
        v-if="currentPage-1 >= 0"
        class="btn btn-ghost"
        @click="$emit('onPageSelected', currentPage-1)"
      >{{currentPage}}</button>
      <button class="btn btn-ghost bg-primary shadow-md">{{currentPage+1}}</button>
      <button
        v-if="currentPage+1 < maxPages"
        class="btn btn-ghost"
        @click="$emit('onPageSelected', currentPage+1)"
      >{{currentPage+2}}</button>
      <button
        v-if="currentPage+3 < maxPages"
        class="btn btn-ghost btn-disabled bg-gray-200 text-gray-500"
      >...</button>
      <button
        v-if="currentPage+3 <= maxPages"
        class="btn btn-ghost"
        @click="$emit('onPageSelected', maxPages-1)"
      >{{maxPages}}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PAGE_SIZE } from "~~/constants/constants";

const { count, next, previous, currentPage } = defineProps([
  "count",
  "next",
  "previous",
  "currentPage",
]);

const maxPages = Math.ceil(count / PAGE_SIZE);
</script>

<style>
</style>