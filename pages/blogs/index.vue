<template>
  <div class="container mx-auto mb-32 pt-12">

    <div class="md:px-0 px-14 flex flex-col gap-4 text-stone-700">
      <div class="flex mb-10">
        <div class="text-lg text-gray-500">HOME</div>
        <div class="text-lg text-gray-500 mx-3">/</div>
        <div class="text-lg text-gray-500">PROJEKTI</div>
      </div>

      <div class="mb-6">
        <div class="text-basis-content font-bold text-5xl pb-4">NAŠI PROJEKTI</div>
        <div class="text-lg">Pogledaj priče o realizaciji tuđih projekata i dobi inspiraciju za svoj</div>
      </div>

      <div
        v-if="featuredBlogsData"
        class="flex flex-col mb-4"
      >
        <div class="pb-3 text-stone-700 text-2xl font-bold">Istaknuti projekti</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
            <IndexProjectsProject 
              v-for="featuredBlog in featuredBlogsData.slice(0, 3)"
              :blog="featuredBlog"
            />            
        </div>
      </div>

      <div
        v-if="blogTagsData"
        class="flex flex-col"
      >
        <div class="pb-3 text-stone-700 text-2xl font-bold">Odaberi kategoriju</div>
        <Tabs
          :tabs="tags"
          :selected-tab-index="Math.max(tags.findIndex(el => el.title === tagSelected?.name), 0)"
          :key="tagSelected?.id"
          @on-tab-clicked="tab => onTabClicked(tab)"
        />
        <div class="divider my-0"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-5">
        <IndexProjectsProject 
          :key="blog.id"
          v-for="blog in getPaginatedBlogs.blogs.slice(0, getPaginatedBlogs.blogs.length)"
          :item="blog"
          :blog="blog"
          @on-tag-clicked="tag => tagSelected = tag"        />           
        
      </div>
      <div
        v-if="getPaginatedBlogs.count && getPaginatedBlogs.count > getPaginatedBlogs.blogs.length"
        class="btn btn-outline btn-wide self-center"
        @click="loadMoreItems"
      >{{ capitalizeOnlyFirstLetter($t('load_more')) }}</div>
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
import { IBlogCategory, IBlogTag, ITab } from "~~/constants/data";
import { PAGE_SIZE } from "~~/constants/constants";

const { t } = useI18n();

const authStore = useAuthStore();
const blogCategoriesStore = useBlogCategoryStore();
const blogListStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref<boolean>(false);

var limit = PAGE_SIZE;
var offset = 0;

const categorySelected = ref<IBlogCategory | null>(null);
const tagSelected = ref<IBlogTag | null>(null);
const searchString = ref<string>("");

const {
  data: featuredBlogsData,
  pending: featuredBlogsPending,
  error: featuredBlogsError,
  refresh: featuredBlogsRefresh,
} = useAsyncData("blogs_featured_blogs", () =>
  blogListStore.fetchFeaturedBlogs()
);

const {
  data: blogTagsData,
  pending: blogTagsPending,
  error: blogTagsError,
  refresh: blogTagsRefresh,
} = useAsyncData("blogs_tags", () => blogListStore.fetchTags());

const tags = computed(() => {
  if (!blogTagsData.value) return [];

  const result = [<ITab>{ title: capitalizeOnlyFirstLetter(t("all")) }];
  result.push(...blogTagsData.value.map((el) => <ITab>{ title: el.name }));
  return result;
});

const {
  data: blogPaginatedData,
  pending: blogPaginatedPending,
  error: blogPaginatedError,
  refresh: blogPaginatedRefresh,
} = useAsyncData("blogs_paginated_blogs", () =>
  blogListStore.fetchPaginatedBlogs()
);

onMounted(async () => {
  showInitLoading.value = true;

  // blogListStore
  //   .fetchPaginatedBlogs(limit, offset, "")
  //   .then((_) => {})
  //   .catch((err) => notificationStore.showFetchError(err))
  //   .finally(() => {
  //     showInitLoading.value = false;
  //   });

  // blogCategoriesStore
  //   .fetchSubcategories()
  //   .catch((err) => notificationStore.showFetchError(err));

  // blogListStore
  //   .fetchTags()
  //   .then((_) => {})
  //   .catch((err) => notificationStore.showFetchError(err))
  //   .finally(() => {});
});

const getFeaturedBlogs = computed(() => {
  return blogListStore.getFeaturedBlogs;
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

const blogTags = computed(() => {
  return blogListStore.getTags;
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
      categorySelected.value?.id ? categorySelected.value.id.toString() : "",
      tagSelected.value?.id ? tagSelected.value.id.toString() : "",
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
        categorySelected.value?.id ? categorySelected.value.id.toString() : "",
        tagSelected.value?.id ? tagSelected.value.id.toString() : "",
        true
      )
      .then(() => (showPageLoading.value = false))
      .catch((err) => notificationStore.showFetchError(err));
  }
}

function onTabClicked(tab: ITab) {
  if (!blogTagsData.value) {
    console.error(`Tag data not found`);
    return;
  }

  if (tab?.title === capitalizeOnlyFirstLetter(t("all"))) {
    console.log("all selected");
    tagSelected.value = null;
    return;
  }

  const tag = blogTagsData.value.find((el) => el.name === tab.title);

  if (!tag) {
    console.error(`Tag with name ${tab.title} not found in blog tags`);
    return;
  }

  tagSelected.value = tag;
}

function onTagClicked(tag: IBlogTag) {
  searchString.value = "";
  tagSelected.value = tag;

  // reset pagination values
  offset = 0;
  limit = 10;

  blogListStore
    .fetchPaginatedBlogs(
      limit,
      offset,
      searchString.value,
      categorySelected.value?.id ? categorySelected.value.id.toString() : "",
      tagSelected.value?.id ? tagSelected.value.id.toString() : "",
      false
    )
    .then(() => (showPageLoading.value = false))
    .catch((err) => notificationStore.showFetchError(err));
}

watch(tagSelected, (value) => {
  searchString.value = "";

  // reset pagination values
  offset = 0;
  limit = 10;

  blogListStore
    .fetchPaginatedBlogs(
      limit,
      offset,
      searchString.value,
      categorySelected.value?.id ? categorySelected.value.id.toString() : "",
      tagSelected.value?.id ? tagSelected.value.id.toString() : "",
      false
    )
    .then(() => (showPageLoading.value = false))
    .catch((err) => notificationStore.showFetchError(err));
});
</script>

<style>
</style>