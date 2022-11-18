<template>
  <p>Hello {{auth.getUser}}</p>
  <div>
    <div class="grid grid-cols-1 gap-5">
      <div
        :key="blog.id"
        v-for="blog in blogs"
      >
        <BlogListTile :blog="blog" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
</script>

<style>
</style>