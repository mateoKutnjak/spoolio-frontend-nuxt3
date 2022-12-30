<template>
  <div class="container px-0 md:p-12">
    <div class="pb-12 pt-3 flex justify-center">
      <SearchBar
        placeholder="Search products"
        @submit-search-phrase="onSearch"
      />
    </div>
    <div v-if="getPaginatedProducts.count || 0 > 0">

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 ">
        <div
          :key="product.id"
          v-for="product in getPaginatedProducts.products"
        >
          <ProductListItem :product="product" />
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
  </div>

</template>
  
  <script lang="ts" setup>
import { useProductListStore } from "~/stores/productList";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const productListStore = useProductListStore();

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref(false);

var limit = 10;
var offset = 0;

onMounted(async () => {
  productListStore
    .fetchPaginatedProducts(limit, offset)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    })
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
        productListStore
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

  productListStore
    .fetchPaginatedProducts(limit, offset, searchPhrase, false)
    .then(() => (showPageLoading.value = false));
}
</script>
  
  <style>
</style>