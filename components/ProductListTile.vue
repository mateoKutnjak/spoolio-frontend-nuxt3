<template>
  <div>
    <NuxtLink :to="`/store/${product.id}/`">
      <div class="card lg:card-side bg-base-100 border-2 rounded-2xl shadow-md">
        <nuxt-img
          class=" m-5 rounded-lg"
          sizes="sm:100vw md:60vw lg:600px"
          fit="fill"
          src="https://placeimg.com/400/300/arch"
          alt="Album"
        />
        <div class="card-body">
          <div class="card-title flex justify-between">
            <h2 class="text-3xl text-gray-800">{{product.title}}</h2>
            <div class="flex gap-2">
              <RatingStars />
              <div class="text-sm font-normal">(45)</div>
            </div>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo maxime eaque ratione cupiditate esse modi, illum expedita optio harum sint velit laboriosam reprehenderit mollitia dolores odit nostrum exercitationem qui voluptatum.</p>
          <div class="card-actions justify-between items-end">
            <div class="flex gap-2 items-end">
              <div class="text-xl text-gray-800">From</div>
              <div class="text-2xl font-bold text-gray-800">${{product.price}}</div>
            </div>
            <button
              class="btn btn-primary gap-1"
              @click.prevent="addToCart(product)"
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
    </NuxtLink>
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