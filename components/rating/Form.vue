<template>
  <div class="w-full card bg-base-100 shadow-md">
    <div class="card-body form-control p-6">
      <div class="flex gap-3 mb-3">
        <div class="text-gray-500 italic font-medium"> {{ capitalizeOnlyFirstLetter($t('how_would_you_rate_this_product')) }}</div>
        <div class="rating">
          <input
            type="radio"
            name="rating-9"
            class="rating-hidden"
            :checked="!ratingValue"
            @click="ratingValue = undefined"
          />
          <input
            type="radio"
            name="rating-9"
            class="mask mask-star-2 bg-primary"
            :checked="ratingValue == 1"
            @click="ratingValue = 1"
          />
          <input
            type="radio"
            name="rating-9"
            class="mask mask-star-2 bg-primary"
            :checked="ratingValue == 2"
            @click="ratingValue = 2"
          />
          <input
            type="radio"
            name="rating-9"
            class="mask mask-star-2 bg-primary"
            :checked="ratingValue == 3"
            @click="ratingValue = 3"
          />
          <input
            type="radio"
            name="rating-9"
            class="mask mask-star-2 bg-primary"
            :checked="ratingValue == 4"
            @click="ratingValue = 4"
          />
          <input
            type="radio"
            name="rating-9"
            class="mask mask-star-2 bg-primary"
            :checked="ratingValue == 5"
            @click="ratingValue = 5"
          />
        </div>
      </div>

      <textarea
        class="textarea textarea-bordered mb-4"
        placeholder="Write a comment"
        rows="3"
        v-model="content"
      ></textarea>
      <div
        class="btn btn-primary"
        :class="[inProgress ? 'loading' : '', ratingValue ? '' : 'btn-disabled']"
        @click="submitHandler"
      >{{ capitalizeOnlyFirstLetter($t('rate')) }}</div>
    </div>

  </div>
</template>
    
    <script lang="ts" setup>
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "~~/stores/auth";
import { useRatingStore } from "~~/stores/rating";
import { useProductStore } from "~~/stores/product";

const { objectId, contentType } = defineProps<{
  objectId: number;
  contentType: string;
}>();

const {t} = useI18n();

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const ratingStore = useRatingStore();

const content = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const ratingValue = ref<number>();

const inProgress = ref(false);

const submitHandler = async () => {
  if (!authStore.accessToken) {
    notificationStore.show(capitalizeOnlyFirstLetter(t('login_to_perform_this_action')), ToastLevelType.info);
    return;
  }

  if (!authStore.getUser?.id) {
    notificationStore.show(capitalizeOnlyFirstLetter(t('login_to_perform_this_action')), ToastLevelType.info);
    return;
  }

  if (!ratingValue.value) {
    notificationStore.show(
      capitalizeOnlyFirstLetter(t('please_rate_this_product_with_stars')),
      ToastLevelType.info
    );
    return;
  }

  inProgress.value = true;

  ratingStore
    .postRating(
      Number(authStore.getUser?.id),
      content.value,
      ratingValue.value,
      objectId,
      contentType
    )
    .then(() => {
      notificationStore.show(capitalizeOnlyFirstLetter(t('saved')), ToastLevelType.success);
      content.value = "";

      // TODO try to avoid reloading window later
      // TODO we rolad because we have to update productStore rating for product without reloading
      // TODO but we want to leave this Form more generic without dependency on printStore
      window.location.reload();
    })
    .catch((err) => {
      notificationStore.show(err, ToastLevelType.error);
    })
    .finally(() => {
      inProgress.value = false;
    });
};
</script>
    
    <style>
</style>