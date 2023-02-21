<template>
  <div class="h-full">
    <NuxtLink :to="`/store/${product.id}/`">
      <div class="card bg-base-100 border-1 rounded-md shadow-md h-full">

        <div
          v-if="product?.productimage_set?.length"
          class="h-44 flex justify-center bg-gray-100"
        >
          <nuxt-img
            class="h-full"
            :src="product?.productimage_set[0].image"
            fit="inside"
          />
        </div>
        <div class="card-body gap-5">
          <div class="flex-1 flex justify-between">
            <div class="w-full flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <div class="mb-2 text-xl text-gray-600 font-normal dark:text-white line-clamp-1">{{product.title}}</div>
                <div v-if="product?.rating_count">
                  <RatingPreview
                    :rating-value="product?.average_rating || 0"
                    :rating-count="product?.rating_count || 0"
                  />
                </div>
                <div
                  v-else
                  class="text-sm font-light italic text-gray-500"
                >
                  No ratings yet
                </div>
              </div>
              <p class="text-sm text-gray-500 font-normal dark:text-white line-clamp-2 mt-1">{{ product.description }}</p>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div
              v-if="product.starting_price"
              class="flex gap-0.5 items-start"
            >
              <div class="font-thin text-lg text-gray-800 mt-1 mr-2">From</div>
              <div class="font-light text-2xl text-gray-800 dark:text-white">${{product.starting_price}}</div>
              <div class="font-light text-gray-800">00</div>
            </div>
            <div v-else></div>

            <div class="btn btn-outline gap-1 border border-gray-400 hover:border-gray-500 text-gray-600 hover:text-gray-700 hover:bg-gray-200">
              <Icon
                name="material-symbols:shopping-cart-outline-rounded"
                size="27"
                aria-hidden="true"
              />Add to cart
            </div>
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