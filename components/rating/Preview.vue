<template>
  <div class="flex gap-2">
    <div class="rating rating-sm rating-half">
      <input
        type="radio"
        class="rating-hidden"
        :checked="ratingValue < 0.25"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-1"
        :checked="ratingValue >= 0.25 && ratingValue < 0.75"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-2"
        :checked="ratingValue >= 0.75 && ratingValue < 1.25"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-1"
        :checked="ratingValue >= 1.25 && ratingValue < 1.75"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-2"
        :checked="ratingValue >= 1.75 && ratingValue < 2.25"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-1"
        :checked="ratingValue >= 2.25 && ratingValue < 2.75"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-2"
        :checked="ratingValue >= 2.75 && ratingValue < 3.25"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-1"
        :checked="ratingValue >= 3.25 && ratingValue < 3.75"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-2"
        :checked="ratingValue >= 3.75 && ratingValue < 4.25"
      />
      <input
        type="radio"
        name="rating-10"
        class="bg-primary mask mask-star-2 mask-half-1"
        :checked="ratingValue >= 4.25 && ratingValue < 4.75"
      />
      <input
        type="radio"
        class="bg-primary mask mask-star-2 mask-half-2"
        :checked="ratingValue >= 4.75"
      />
    </div>
    <div
      v-show="ratingCount"
      class="text-sm font-normal text-gray-700"
    >({{ ratingCount }})</div>
  </div>
</template>

<script lang="ts" setup>
const { ratingValue, ratingCount } = defineProps<{
  ratingValue: number;
  ratingCount?: number;
}>();
</script>

<style>
</style>