<template>
  <div class="w-full flex flex-col gap-8 items-start">
    <h3 class="text-lg font-semibold text-gray-900">{{ capitalizeOnlyFirstLetter($t('ratings')) }}</h3>
    <RatingForm
      v-if="!ratedByMe"
      :object-id="objectId"
      :content-type="contentType"
    />
    <div
      v-if="ratings.length > 0"
      class="flex flex-col items-center gap-5"
    >
      <div class="space-y-4 my-5">
        <div
          :key="rating.id"
          v-for="rating in ratings"
        >
          <RatingItem :rating="rating" />
        </div>
      </div>
      <div
        v-if="ratings.length < count"
        class="btn btn-primary"
        @click="loadMoreRatings"
      >{{ capitalizeOnlyFirstLetter($t('load_more')) }}</div>

    </div>
    <div
      v-else
      class="flex justify-center italic"
    >
    {{ capitalizeOnlyFirstLetter($t('nothing_to_show')) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { PAGE_SIZE } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { useRatingStore } from "~~/stores/rating";

const ratingStore = useRatingStore();
const notificationStore = useNotificationStore();

const { objectId, contentType, ratedByMe } = defineProps<{
  objectId: number;
  contentType: string;
  ratedByMe: boolean;
}>();

const { ratings } = storeToRefs(ratingStore);

const count = computed(() => ratingStore.getCount);

ratingStore
  .fetchRatings(objectId, contentType)
  .catch((err) => notificationStore.showFetchError(err));

function loadMoreRatings() {
  ratingStore
    .fetchRatings(
      objectId,
      contentType,
      PAGE_SIZE,
      ratingStore.ratings.length,
      true
    )
    .catch((err) => notificationStore.showFetchError(err));
}
</script>

<style>
</style>