<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <UserAvatar :user-data="comment?.user" />
    </div>
    <div class="border bg-white rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed text-gray-700">
      <strong>{{ displayUserName }}</strong>
      <span class="text-xs text-gray-400 px-2">{{reformatDate(comment.created_at)}}</span>
      <p class="text-sm mt-1">
        {{comment.content}}
      </p>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { IComment, IUser } from "~~/constants/data";

const { comment } = defineProps<{
  comment: IComment;
}>();

const displayUserName = computed(() => {
  if ((comment.user as IUser).profile) {
    return (
      (comment.user as IUser).profile?.first_name +
      " " +
      (comment.user as IUser).profile?.last_name
    );
  }
  return "Anonymous";
});
</script>
  
  <style>
</style>