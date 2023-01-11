<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <UserAvatar :user-data="item?.user" />
    </div>
    <div class="border bg-white rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed text-gray-700">
      <strong v-if="!comment.user.profile?.first_name && !comment.user.profile?.last_name">Anonymous</strong>
      <strong v-else>{{(comment.user.profile?.first_name || '')}} {{comment.user.profile?.last_name || ''}}</strong>
      <span class="text-xs text-gray-400 px-2">{{reformatDate(comment.created_at)}}</span>
      <p class="text-sm">
        {{comment.content}}
      </p>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { comment: item } = defineProps(["comment"]);

const { user } = authStore;

const hasAnyName = computed(() => {
  return item.user.profile?.first_name || item.user.profile?.last_name;
});

const isCurrentyLoggedUser = computed(() => {
  if (item.user?.email && user?.email) {
    return item.user.email === user.email;
  }
  return false;
});
</script>
  
  <style>
</style>