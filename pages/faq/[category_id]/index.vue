<template>
    <div class="container mx-auto max-w-5xl py-12">
      <div class="flex flex-col gap-6">
        <div
          v-if="faqCategories && faqCategory"
          class="mb-12 px-12 flex gap-3 items-center"
        >
          <NuxtLink
            class="link uppercase"
            :to="localePath('/faq')"
          >{{$t( 'frequently_asked_questions' )}}</NuxtLink>
          /
          <Dropdown
            :items="faqCategories"
            :extract-name="(el: IFaqCategory) => el.name"
            :preselected-item="faqCategory"
            size="sm"
            background-color="bg-primary/20"
            text-color="text-primary"
            items-width="w-96"
            :uppercase="true"
            @on-item-clicked="(item: IFaqCategory) => onCategoryClicked(item)"
          />
        </div>
        <div
          v-if="faqCategory"
          class="px-12 text-4xl font-bold"
        >{{ $t(faqCategory.name).toUpperCase() }}</div>
        <div class="px-12 space-x-1.5 max-w-3xl">
          <span class="mt-12">{{ capitalizeOnlyFirstLetter($t('find_out_more_details_about_each_of_the_production_methods_offered_on_our_farm')) }}.</span>
          <span class="">{{ capitalizeOnlyFirstLetter($t('information_about')) }}</span>
          <span class="font-bold">{{ $t('mode_of_operation_3d_printer_models') }}</span>
          <span>{{ $t('which_we_have_in_out_inventory_and') }}</span>
          <span class="font-bold">{{ $t('their_capabilities') }}</span>
          <span>{{ $t('read_in_the_offered_articles') }}.</span>
        </div>
        <div
          v-if="faqBlogs.length"
          class="mt-4 md:px-12 px-0 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6"
        >
          <FaqItem
            v-for="blog in faqBlogs"
            :key="blog.id"
            :item="blog"
          />
        </div>
        <div
          v-else
          class="pt-12 mb-24"
        >
          <EmptyPlaceholder />
        </div>
        <div
          v-if="faqStore.count && faqStore.count > faqStore.faqBlogs.length"
          class="btn btn-outline btn-wide self-center"
          @click="loadMoreItems"
        >{{ capitalizeOnlyFirstLetter($t('load_more')) }}</div>
      </div>
    </div>
  </template>
    
    <script lang="ts" setup>
  import { PAGE_SIZE } from "~~/constants/constants";
  import { IFaqCategory } from "~~/constants/data";
  import { useFaqStore } from "~~/stores/faq";
  
  const localePath = useLocalePath();
  
  const faqStore = useFaqStore();
  
  const { category_id } = useRoute().params;
  const categoryId = Number(category_id);
  
  if (!categoryId) {
    throw createError(`Category ID=${categoryId}`);
  }
  
  if (!faqStore.getFaqCategories.length) {
    await useAsyncData("faq_categories2", () => faqStore.fetchCategories());
  }
  
  const faqCategory = computed(() => faqStore.getFaqCategoryById(categoryId));
  const faqCategories = computed(() => faqStore.getFaqCategories);
  
  var limit = PAGE_SIZE;
  var offset = 0;
  
  const {
    data: faqData,
    pending: faqPending,
    error: faqError,
    refresh: faqRefresh,
  } = useAsyncData("faq_blogs", () =>
    faqStore.fetchPaginated(limit, offset, categoryId.toString(), false)
  );
  
  const faqBlogs = computed(() => faqStore.getPaginatedFaqBlogs);
  
  function loadMoreItems() {
    if (
      faqData.value?.next &&
      faqData.value?.count &&
      faqData.value?.count > offset
    ) {
      offset = offset + limit;
  
      const {
        data: faqData,
        pending: faqPending,
        error: faqError,
        refresh: faqRefresh,
      } = useAsyncData("faq_blogs", () =>
        faqStore.fetchPaginated(limit, offset, categoryId.toString(), true)
      );
    }
  }
  
  function onCategoryClicked(cat: IFaqCategory) {
    navigateTo(localePath(`/faq/${cat.id}`));
  }
  </script>
    
    <style>
  </style>