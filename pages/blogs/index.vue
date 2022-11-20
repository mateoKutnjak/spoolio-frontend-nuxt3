<template>
  <div class="grid grid-cols-1 gap-5">
    <div
      :key="blog.id"
      v-for="blog in getPaginatedBlogs.blogs"
    >
      <BlogListTile :blog="blog" />
    </div>
  </div>
  <CircularLoadingIndicator :show="showPageLoading" />
</template>

<script setup>
import { useBlogStore } from "~/stores/blog";

const blogStore = useBlogStore();
const showPageLoading = ref(false);

var limit = 10;
var offset = 0;

blogStore.fetchBlogs(limit, offset);

const getPaginatedBlogs = computed(() => {
  return blogStore.getPaginatedBlogs;
});

onMounted(() => {

  // Function listener which detects 
  // when page is scrolled to the bottom
  window.onscroll = () => {
    let bottomOfWindow =
      Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) +
        window.innerHeight ===
      document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      console.log("bottomOfWindow");
      // this.page++;
      console.log(getPaginatedBlogs);
      if (
        getPaginatedBlogs.value.next &&
        getPaginatedBlogs.value.count > offset
      ) {
        showPageLoading.value = true;
        offset = offset + limit;
        blogStore
          .fetchBlogs(10, offset, true)
          .then(() => (showPageLoading.value = false));
      }
    }
  };
});
</script>

<style>
</style>