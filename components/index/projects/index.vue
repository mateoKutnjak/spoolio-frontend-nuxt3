<template>
  <div
    v-if="data"
    class="flex flex-col justify-center mb-32"
  >
    <div class="xl:text-7xl md:text-6xl font-bold text-base-content pb-10">{{ $t('projects').toUpperCase() }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
      <div
        v-for="blog in data.slice(0, 3)"
        :key="blog.id"
      >
        <IndexProjectsProject :blog="blog" />
      </div>
    </div>

    <ButtonFindOutMore
      class="self-end"
      :to="localePath('/blogs')"
    />
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