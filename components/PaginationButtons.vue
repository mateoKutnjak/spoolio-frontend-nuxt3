<template>
  <div class="flex flex-col gap-3 items-center">
    <div class="grid grid-flow-col auto-cols-max gap-1">
      <button
        v-if="currentPage-3 >= 0"
        class="btn  btn-ghost btn-square rounded-md text-gray-500"
        @click="$emit('onPageSelected', 0)"
      >
        <Icon
          name="lucide:chevron-first"
          size="20"
        />
      </button>
      <button
        v-if="currentPage-3 >= 0"
        class="btn btn-ghost btn-square btn-disabled rounded-md bg-transparent text-gray-600"
      >
        <Icon
          name="ph:dots-three"
          size="25"
        />
      </button>
      <button
        v-if="currentPage-2 >= 0"
        class="btn btn-ghost btn-square rounded-md text-gray-600"
        @click="$emit('onPageSelected', currentPage-2)"
      >{{currentPage-1}}</button>
      <button
        v-if="currentPage-1 >= 0"
        class="btn btn-ghost btn-square rounded-md text-gray-600"
        @click="$emit('onPageSelected', currentPage-1)"
      >{{currentPage}}</button>
      <button class="btn btn-primary btn-square rounded-md">{{currentPage+1}}</button>
      <button
        v-if="currentPage+1 < maxPages"
        class="btn btn-ghost btn-square rounded-md text-gray-600"
        @click="$emit('onPageSelected', currentPage+1)"
      >{{currentPage+2}}</button>
      <button
        v-if="currentPage+2 < maxPages"
        class="btn btn-ghost btn-square rounded-md text-gray-600"
        @click="$emit('onPageSelected', currentPage+2)"
      >{{currentPage+3}}</button>
      <button
        v-if="currentPage+3 < maxPages"
        class="btn btn-ghost btn-square btn-disabled bg-transparent rounded-md text-gray-600"
      >
        <Icon
          name="ph:dots-three"
          size="20"
        />
      </button>
      <button
        v-if="currentPage+4 <= maxPages"
        class="btn btn-ghost btn-square rounded-md text-gray-500"
        @click="$emit('onPageSelected', maxPages-1)"
      >
        <Icon
          name="lucide:chevron-last"
          size="20"
        />
      </button>
    </div>
    <div class="text-gray-500 text-sm">
      {{ capitalizeOnlyFirstLetter($t('showing_results')) }} {{ currentPage * PAGE_SIZE + 1 }}-{{ Math.min((currentPage+1) * PAGE_SIZE, count) }} {{ $t('of') }} {{ count }}
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