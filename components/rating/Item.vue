<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <UserAvatar :user-data="rating?.user" />
    </div>

    <div class="border bg-white rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed text-gray-700">
      <div class="rating rating-sm mr-2">
        <input
          type="radio"
          class="mask mask-star-2 bg-primary"
          :checked="rating.value === 1"
        />
        <input
          type="radio"
          class="mask mask-star-2 bg-primary"
          :checked="rating.value === 2"
        />
        <input
          type="radio"
          class="mask mask-star-2 bg-primary"
          :checked="rating.value === 3"
        />
        <input
          type="radio"
          class="mask mask-star-2 bg-primary"
          :checked="rating.value === 4"
        />
        <input
          type="radio"
          class="mask mask-star-2 bg-primary"
          :checked="rating.value === 5"
        />
      </div>
      <strong>{{ displayUserName }}</strong>
      <span class="text-xs text-gray-400 px-2">{{reformatDate(rating.created_at)}}</span>
      <p
        v-if="rating.content"
        class="text-sm mt-3"
      >
        {{rating.content}}
      </p>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { IUserResponse } from "~~/stores/auth";
import IRatingResponse from "~~/stores/rating";

const { rating } = defineProps<{
  rating: IRatingResponse;
}>();

const displayUserName = computed(() => {
  if ((rating.user as IUserResponse).profile) {
    return (
      (rating.user as IUserResponse).profile?.first_name +
      " " +
      (rating.user as IUserResponse).profile?.last_name
    );
  }
  return "Anonymous";
});
</script>
  
  <style>
</style>