<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div class="pb-12 flex justify-between items-center">
      <div class="text-4xl">{{ capitalizeOnlyFirstLetter($t('products')) }}</div>
      <SearchBar
        placeholder="Search products"
        @submit-search-phrase="onSearch"
      />
    </div>
    <div v-if="getPaginatedProducts.count || 0 > 0">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div
          :key="product.id"
          v-for="product in getPaginatedProducts.products"
        >
          <StoreItem :product="product" />
        </div>
      </div>
      <div
        v-if="getPaginatedProducts.count && getPaginatedProducts.count > getPaginatedProducts.products.length"
        class="btn btn-outline"
        @click="loadMoreItems"
      >{{ capitalizeOnlyFirstLetter($t('load_more')) }}</div>
    </div>
    <div v-else-if="showInitLoading">
      <div class="grid justify-center h-56">
        <progress class="progress w-56"></progress>
      </div>
    </div>
    <EmptyPlaceholder v-else />
  </div>

</template>
  
  <script lang="ts" setup>
import { useProductListStore } from "~/stores/productList";
import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const productListStore = useProductListStore();

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref(false);

var limit = 10;
var offset = 0;

onMounted(async () => {
  productListStore
    .fetchPaginatedProducts(limit, offset)
    .then(() => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {
      showInitLoading.value = false;
    });
});

const getPaginatedProducts = computed(() => {
  return productListStore.getPaginatedProducts;
});

const getUser = computed(() => {
  return authStore.getUser;
});

function onSearch(searchPhrase: string) {
  console.debug(`New search phrase: ${searchPhrase}`);

  // reset pagination values
  offset = 0;
  limit = 10;

  productListStore
    .fetchPaginatedProducts(limit, offset, searchPhrase, false)
    .then(() => (showPageLoading.value = false))
    .catch((err) => notificationStore.showFetchError(err));
}

function loadMoreItems() {
  if (
    getPaginatedProducts.value.next &&
    getPaginatedProducts.value.count &&
    getPaginatedProducts.value.count > offset
  ) {
    showPageLoading.value = true;
    offset = offset + limit;
    productListStore
      .fetchPaginatedProducts(limit, offset, "", true)
      .then(() => (showPageLoading.value = false))
      .catch((err) => notificationStore.showFetchError(err));
  }
}
</script>
  
  <style>
</style>