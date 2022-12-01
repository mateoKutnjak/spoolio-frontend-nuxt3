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
import { useAuthStore } from "../stores/auth";
import { useCommentStore } from "../stores/comment";

const { blogId } = defineProps(["blogId"]);

const authStore = useAuthStore();
const commentStore = useCommentStore();

const content = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const commentPostingInProgress = ref(false);
const submitted = ref(false);

const submitHandler = async () => {
  if (!authStore.accessToken) {
    console.error("No access token. Cannot post comment");
    return;
  }

  if (!authStore.getUser?.id) {
    console.error("No current user id. Cannot post comment");
    return;
  }

  commentPostingInProgress.value = true;

  await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
  commentStore
    .postComment(
      authStore.accessToken,
      Number(authStore.getUser?.id),
      Number(blogId),
      content.value
    )
    .then(() => {})
    .catch((err) => {})
    .finally(() => {
      commentPostingInProgress.value = false;
    });
};
</script>
  
  <style>
</style>