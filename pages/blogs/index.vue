<template>
  <div class="pb-12">
    <SearchBar
      placeholder="Search projects"
      @submit-search-phrase="onSearch"
    />
  </div>
  <div
    v-if="getUser && getUser.is_staff"
    class="pb-8 grid place-items-center"
  >
    <NuxtLink to="/blogs/create">
      <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Write new blog
        </span>
      </button>
    </NuxtLink>
  </div>
  <div class="grid grid-cols-1 gap-5 ">
    <div
      :key="blog.id"
      v-for="blog in getPaginatedBlogs.blogs"
    >
      <BlogListTile :blog="blog" />
    </div>
  </div>
  <CircularLoadingIndicator :show="showPageLoading" />
</template>

<script lang="ts" setup>
import { useBlogStore } from "~/stores/blog";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const blogStore = useBlogStore();
const showPageLoading = ref(false);

var limit = 10;
var offset = 0;

blogStore.fetchPaginatedBlogs(limit, offset);

const getPaginatedBlogs = computed(() => {
  return blogStore.getPaginatedBlogs;
});

const getUser = computed(() => {
  return authStore.getUser;
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
      console.log(getPaginatedBlogs);
      if (
        getPaginatedBlogs.value.next &&
        getPaginatedBlogs.value.count &&
        getPaginatedBlogs.value.count > offset
      ) {
        showPageLoading.value = true;
        offset = offset + limit;
        blogStore
          .fetchPaginatedBlogs(limit, offset, "", true)
          .then(() => (showPageLoading.value = false));
      }
    }
  };
});

function onSearch(searchPhrase: string) {
  console.debug(`New search phrase: ${searchPhrase}`);

  // reset pagination values
  offset = 0;
  limit = 10;

  blogStore
    .fetchPaginatedBlogs(limit, offset, searchPhrase, false)
    .then(() => (showPageLoading.value = false));
}
</script>

<style>
</style>