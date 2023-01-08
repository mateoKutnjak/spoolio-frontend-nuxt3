<template>
  <div>
    <NuxtLink :to="`/store/${product.id}/`">
      <div class="card bg-base-100 border-1 rounded-md shadow-md">
        <div class="relative">

          <div
            v-if="product?.productimage_set?.length"
            class="flex flex-col gap-3 items-center mx-auto bg-gray-300"
          >
            <nuxt-img
              class="rounded-2xl h-44"
              :src="product?.productimage_set[0].image"
              fit="contain"
            />
          </div>

          <div class="absolute top-4 right-4 btn btn-circle border-none bg-white">
            <Icon
              class="text-gray-500"
              name="mdi:cards-heart-outline"
              size="25"
            />
          </div>

        </div>
        <div class="card-body gap-4">
          <div class="flex justify-between">
            <div class="flex flex-col gap-1">
              <h2 class="card-title text-base text-gray-700">{{product.title}}</h2>
              <p class="text-gray-700 line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo maxime eaque ratione cupiditate esse modi, illum expedita optio harum sint velit laboriosam reprehenderit mollitia dolores odit nostrum exercitationem qui voluptatum.</p>
            </div>
            <div
              v-if="product.starting_price"
              class="flex gap-0.5 items-start"
            >
              <div class="text-2xl font-bold text-gray-700">${{product.starting_price}}</div>
              <div class="font-bold text-gray-700">00</div>
            </div>
            <div v-else></div>
          </div>
          <div class="flex gap-2 items-center">
            <RatingStars />
            <div class="text-sm font-normal">(45)</div>
          </div>
          <div class="btn btn-accent btn-outline gap-1 rounded-3xl">
            <Icon
              name="material-symbols:shopping-cart-outline-rounded"
              size="27"
              aria-hidden="true"
            />Add to cart
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>

</template>
    
    <script lang="ts" setup>
import { IProductResponse } from "~~/stores/product";
import { useCartStore } from "~~/stores/cart";
import { useNotificationStore } from "~~/stores/notification";

const cartStore = useCartStore();
const notificationStore = useNotificationStore();

const { product } = defineProps(["product"]); // props
</script>
    
    <style>
</style>