<template>
  <div
    v-if="data"
    class="flex flex-col gap-6 justify-center px-12 md:px-0"
  >
    <div class="text-5xl font-bold text-stone-600">{{ $t('projects').toUpperCase() }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="blog in data.slice(0, 3)"
        :key="blog.id"
      >
        <IndexProjectsBlog :blog="blog" />
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