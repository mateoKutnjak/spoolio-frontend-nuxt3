<template>
  <div class="container mx-auto max-w-7xl py-24">
    <div class="flex flex-col gap-6">
      <div class="px-12 text-5xl font-bold">{{ $t('frequently_asked_questions').toUpperCase() }}</div>
      <div class="px-12 space-x-1.5 max-w-3xl">
        <span class="mt-12">{{ capitalizeOnlyFirstLetter($t('answers_to_questions_related_to')) }}</span>
        <span class="font-bold">{{ $t('_3d_printing_methods_materials_and_design_principles_for_3d_printing') }}</span>
        <span>{{ $t('you_can_find_in_the_following_categories') }}:</span>
      </div>
      <div
        v-if="faqCategoriesData"
        class="mt-4 md:px-12 px-0 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6"
      >
        <FaqCategoryItem
          v-for="category in faqCategoriesData"
          :key="category.id"
          :item="category"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFaqStore } from "~~/stores/faq";

const faqStore = useFaqStore();

const {
  data: faqCategoriesData,
  pending: faqCategoriesPending,
  error: faqCategoriesError,
  refresh: faqCategoriesRefresh,
} = useAsyncData("faq_categories", () => faqStore.fetchCategories());
</script>

<style>
</style>