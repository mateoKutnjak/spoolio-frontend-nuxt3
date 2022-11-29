<template>
  <div class="card sm:card-side bg-base-100 shadow-xl">
    <nuxt-img
      sizes="sm:100vw md:60vw lg:400px"
      fit="fill"
      :modifiers="{ roundCorner: '0:100' }"
      src="https://placeimg.com/300/300/arch"
      alt=""
    />
    <div class="card-body">
      <div class="card-title flex justify-between">
        <h2 class="text-lg text-accent">{{product.title}}</h2>
        <h2 class="text-lg text-primary">${{product.price}}</h2>
      </div>
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