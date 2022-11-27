<template>
  <div class="card md:card-side bg-base-100 shadow-xl">
    <figure><img
        src="https://placeimg.com/400/400/arch"
        alt="Album"
      /></figure>
    <div class="card-body">
      <h2 class="card-title">{{product.title}}</h2>
      <p>Click the button to listen on Spotiwhy app.</p>
      <div class="card-actions justify-end">

        <NuxtLink :to="`/store/${product.id}/`">

          <button class="btn btn-outline">
            Details
          </button>
        </NuxtLink>

        <button
          class="btn btn-primary gap-1"
          @click="addToCart(product)"
        >
          <Icon
            name="material-symbols:shopping-cart-outline-rounded"
            size="27"
            aria-hidden="true"
          />Add to cart
        </button>
      </div>
    </div>
  </div>

</template>
  
  <script lang="ts" setup>
import IProductResponse from "../stores/product";
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();

const { product } = defineProps(["product"]); // props

function addToCart(product: IProductResponse) {
  cartStore.add(product);
}
</script>
  
  <style>
</style>