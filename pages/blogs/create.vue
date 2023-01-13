<template>
  <div class="container p-12">
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

if (!authStore.getUser) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Founded" });
}
</script>

<style>
</style>