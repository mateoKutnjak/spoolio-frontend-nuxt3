<template>
  <div class="flex flex-col gap-6 justify-center px-12 md:px-0">
    <div class="text-3xl font-bold text-stone-600">{{ $t('projects').toUpperCase() }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="blog in data"
        :key="blog.id"
      >
        <IndexProjectsBlog :blog="blog" />
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useBlogListStore } from "~~/stores/blogList";

const blogListStore = useBlogListStore();

const { data, pending, error, refresh } = await useAsyncData(
  "index_projects_featured_blogs",
  () => blogListStore.fetchFeaturedBlogs()
);
</script>
  
  <style>
</style>