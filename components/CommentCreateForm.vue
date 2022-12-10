<template>
  <div class="flex gap-4 justify-end items-center">
    <div class="form-control flex-1">
      <label class="label">
      </label>
      <textarea
        class="textarea textarea-bordered h-2"
        placeholder="Write a comment"
        v-model="content"
      ></textarea>
      <label class="label">
      </label>
    </div>
    <div
      class="btn btn-primary"
      :class="[commentPostingInProgress ? 'loading' : '', content.length ? '' : 'btn-disabled']"
      @click="submitHandler"
    >Comment</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useCommentListStore } from "~~/stores/commentList";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "../stores/auth";

const { blogId } = defineProps(["blogId"]);

const authStore = useAuthStore();
const commentStore = useCommentListStore();
const notificationStore = useNotificationStore();

const content = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const commentPostingInProgress = ref(false);
const submitted = ref(false);

const submitHandler = async () => {
  if (!authStore.accessToken) {
    notificationStore.show("Log in to post comment", ToastLevel.info());
    return;
  }

  if (!authStore.getUser?.id) {
    notificationStore.show("Log in to post comment", ToastLevel.info());
    return;
  }

  commentPostingInProgress.value = true;

  // await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
  commentStore
    .postComment(Number(authStore.getUser?.id), Number(blogId), content.value)
    .then(() => {
      notificationStore.show("Comment posted", ToastLevel.success());
    })
    .catch((err) => {
      notificationStore.show(err, ToastLevel.error());
    })
    .finally(() => {
      commentPostingInProgress.value = false;
    });
};
</script>
  
  <style>
</style>