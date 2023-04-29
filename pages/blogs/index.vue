<template>
  <div class="container mx-auto">
    <div class="px-12 md:px-0 pb-12 flex flex-col md:flex-row gap-6 justify-between">
      <div class="text-4xl text-gray-700">Projects</div>
      <SearchBar
        placeholder="Search projects"
        @submit-search-phrase="onSearch"
      />
      <div
        v-if="user?.is_staff || false"
        class="grid place-items-stretch"
      >
        <NuxtLink to="/blogs/create">
          <button class="btn btn-outline btn-accent btn-block gap-2">
            <Icon
              name="lucide:plus"
              size="20"
              aria-hidden="true"
            />New blog
          </button>
        </NuxtLink>

      </div>
    </div>
    <div class="flex gap-5">
      <div
        class="link link-hover"
        @click="categorySelected = ''"
      >All</div>
      <div
        v-for="blogCategory in blogCategories"
        :key="blogCategory.id"
      >
        <div
          class="link link-hover"
          @click="categorySelected = blogCategory.id.toString()"
        > {{ blogCategory.name }}</div>
      </div>
    </div>
    <div class="divider h-[1px] mt-2 mb-12 bg-gray-500"></div>
    <div
      v-if="getPaginatedBlogs.count || 0 > 0"
      class="flex flex-col gap-8 items-center"
    >
      <div class="w-full flex flex-col gap-10">
        <BlogHeadCard :blog="getPaginatedBlogs.blogs[0]" />
        <div class="grid lg:grid-cols-2 gap-10">
          <div
            :key="blog.id"
            v-for="blog in getPaginatedBlogs.blogs.slice(1, getPaginatedBlogs.blogs.length)"
          >
            <BlogCard :item="blog" />
          </div>
        </div>
      </div>
      <div
        v-if="getPaginatedBlogs.count && getPaginatedBlogs.count > getPaginatedBlogs.blogs.length"
        class="btn btn-outline"
        @click="loadMoreItems"
      >Load more</div>
    </div>
    <div v-else-if="showInitLoading">
      <div class="flex flex-col gap-12">
        <FacebookLoader
          v-for="index in 10"
          :key="index"
          primary-color="#dddddd"
          secondary-color="#e5e5e5"
        ></FacebookLoader>
      </div>
    </div>
    <div v-else>
      <div class="grid justify-center h-56 h-56">
        Nothing to show
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useBlogListStore } from "~/stores/blogList";
import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";
import { FacebookLoader } from "vue-content-loader";
import { useBlogCategoryStore } from "~~/stores/blogCategory";

const authStore = useAuthStore();
const blogCategoriesStore = useBlogCategoryStore();
const blogListStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref<boolean>(false);

var limit = 10;
var offset = 0;

const categorySelected = ref<string>("");
const searchString = ref<string>("");

onMounted(() => {
  showInitLoading.value = true;
  blogListStore
    .fetchPaginatedBlogs(limit, offset, "")
    .then((_) => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {
      showInitLoading.value = false;
    });

  blogCategoriesStore
    .fetchSubcategories()
    .catch((err) => notificationStore.showFetchError(err));
});

const getPaginatedBlogs = computed(() => {
  return blogListStore.getPaginatedBlogs;
});

const blogCategories = computed(() => {
  return blogCategoriesStore.getCategories;
});

const blogSubcategories = computed(() => {
  return blogCategoriesStore.getSubcategories;
});

const getUser = computed(() => {
  user.value = authStore.getUser;
  return authStore.getUser;
});

watch(getUser, (value, old, invalidate) => {
  user.value = value;
});

function onSearch(searchPhrase: string) {
  console.debug(`New search phrase: ${searchPhrase}`);

  searchString.value = searchPhrase;

  // reset pagination values
  offset = 0;
  limit = 10;

  blogListStore
    .fetchPaginatedBlogs(
      limit,
      offset,
      searchPhrase,
      categorySelected.value || "",
      false
    )
    .then(() => (showPageLoading.value = false))
    .catch((err) => notificationStore.showFetchError(err));
}

function loadMoreItems() {
  if (
    getPaginatedBlogs.value.next &&
    getPaginatedBlogs.value.count &&
    getPaginatedBlogs.value.count > offset
  ) {
    showPageLoading.value = true;
    offset = offset + limit;
    blogListStore
      .fetchPaginatedBlogs(
        limit,
        offset,
        searchString.value,
        categorySelected.value || "",
        true
      )
      .then(() => (showPageLoading.value = false))
      .catch((err) => notificationStore.showFetchError(err));
  }
}

watch(categorySelected, (value) => {
  if (value) {
    limit = 10;
    offset = 0;

    blogListStore.fetchPaginatedBlogs(
      limit,
      offset,
      searchString.value,
      value,
      false
    );
  }
});
</script>

<style>
</style>