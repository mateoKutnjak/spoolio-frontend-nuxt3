<template>
  <div class="container mx-auto">
    <p>Add form here</p>
    <br>
    <p>Title</p>
    <p>Subtitle</p>
    <p>Content (markdown editor)</p>
    <p>Picture upload</p>
    <p>Type</p>
    <br>
    <p>Submit button</p>
  </div>

</template>

<script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const getUser = computed(() => authStore.getUser);

if (!getUser.value) {
  throw createError("Cannot access this site if you are not authenticated");
}
</script>

<style>
</style>