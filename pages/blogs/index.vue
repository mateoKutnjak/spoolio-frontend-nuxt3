<template>
  <div>
    <div class="grid grid-cols-1 gap-5">
      <div
        :key="blog.id"
        v-for="blog in getPaginatedBlogs.blogs"
      >
        <BlogListTile :blog="blog" />
      </div>
    </div>
  </div>
  <Pagination :count="getPaginatedBlogs.count"/>
</template>

<script setup>
import { useBlogStore } from "~/stores/blog";

const blogStore = useBlogStore();

blogStore.fetchBlogs();

const getPaginatedBlogs = computed(() => {
  return blogStore.getPaginatedBlogs;
});
</script>

<style>
</style>