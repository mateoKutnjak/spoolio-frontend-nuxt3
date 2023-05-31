<template>
  <div class="flex flex-col gap-8">
    <h3 class="text-lg font-semibold text-gray-900">{{ capitalizeOnlyFirstLetter($t('comments')) }}</h3>
    <CommentForm
      :object-id="objectId"
      :content-type="contentType"
    />
    <div
      v-if="comments.length > 0"
      class="flex flex-col items-center gap-5"
    >
      <div class="space-y-4 my-5">
        <div
          :key="comment.id"
          v-for="comment in comments"
        >
          <CommentItem :comment="comment" />
        </div>
      </div>
      <div
        v-if="comments.length < commentCount"
        class="btn btn-primary"
        @click="loadMoreComments"
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
import { useCommentListStore } from "~~/stores/commentList";
import { useNotificationStore } from "~~/stores/notification";

const commentListStore = useCommentListStore();
const notificationStore = useNotificationStore();

const { objectId, contentType } = defineProps<{
  objectId: number;
  contentType: string;
}>();

const { comments } = storeToRefs(commentListStore);

const commentCount = computed(() => commentListStore.getCommentCount);

commentListStore
  .fetchComments(objectId, contentType)
  .catch((err) => notificationStore.showFetchError(err));

function loadMoreComments() {
  commentListStore
    .fetchComments(
      objectId,
      contentType,
      PAGE_SIZE,
      commentListStore.comments.length,
      true
    )
    .catch((err) => notificationStore.showFetchError(err));
}
</script>

<style>
</style>