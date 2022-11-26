<template>
  <div v-if="getPaginatedBlogs.count || 0 > 0">
    <div class="pb-12 pt-3 flex gap-3 justify-center">
      <SearchBar
        placeholder="Search projects"
        @submit-search-phrase="onSearch"
      />
      <div
        v-if="isStaffUser"
        class="grid place-items-center"
      >
        <NuxtLink to="/blogs/create">
          <button class="btn btn-outline btn-accent gap-2">
            <Icon
              name="material-symbols:add"
              size="20"
              aria-hidden="true"
            />New blog
          </button>
        </NuxtLink>

      </div>
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
  </div>
  <div v-else-if="showInitLoading">
    <div class="grid justify-center h-56">
      <progress class="progress w-56"></progress>
    </div>
  </div>
  <div v-else>
    <div class="grid justify-center h-56 h-56">
      Nothing to show

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBlogListStore } from "~/stores/blogList";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const blogListStore = useBlogListStore();

const isStaffUser = ref<boolean>(false);
const showInitLoading = ref<boolean>(true);
const showPageLoading = ref<boolean>(false);

var limit = 10;
var offset = 0;

onMounted(() => {
  blogListStore.fetchPaginatedBlogs(limit, offset).then(() => {
    showInitLoading.value = false;
  });
});

const getPaginatedBlogs = computed(() => {
  return blogListStore.getPaginatedBlogs;
});

const getUser = computed(() => {
  isStaffUser.value = authStore.getUser?.is_staff || false;
  return authStore.getUser;
});

watch(getUser, (value, old, invalidate) => {
  isStaffUser.value = value?.is_staff || false;
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
        blogListStore
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

  blogListStore
    .fetchPaginatedBlogs(limit, offset, searchPhrase, false)
    .then(() => (showPageLoading.value = false));
}
</script>

<style>
</style>