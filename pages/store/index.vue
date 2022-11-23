<template>
  <div class="pb-12">
    <SearchBar
      placeholder="Search products"
      @submit-search-phrase="onSearch"
    />
  </div>

  <div class="grid grid-cols-1 gap-5 ">
    <div
      :key="product.id"
      v-for="product in getPaginatedProducts.products"
    >
      <ProductListTile :product="product" />
    </div>
  </div>
  <CircularLoadingIndicator :show="showPageLoading" />
</template>
  
  <script lang="ts" setup>
import { useProductStore } from "~/stores/product";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const productStore = useProductStore();
const showPageLoading = ref(false);

var limit = 10;
var offset = 0;

productStore.fetchPaginatedProducts(limit, offset);

const getPaginatedProducts = computed(() => {
  return productStore.getPaginatedProducts;
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
      console.log(getPaginatedProducts);
      if (
        getPaginatedProducts.value.next &&
        getPaginatedProducts.value.count &&
        getPaginatedProducts.value.count > offset
      ) {
        showPageLoading.value = true;
        offset = offset + limit;
        productStore
          .fetchPaginatedProducts(limit, offset, "", true)
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

  productStore
    .fetchPaginatedProducts(limit, offset, searchPhrase, false)
    .then(() => (showPageLoading.value = false));
}
</script>
  
  <style>
</style>