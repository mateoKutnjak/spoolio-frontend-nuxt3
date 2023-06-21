<template>
  <div class="h-full">
    <NuxtLink :to="localePath(`/store/${product.id}/`)">
      <div class="card bg-base-100 border-1 rounded-sm shadow h-full">

        <div
          v-if="product?.productimage_set?.length"
          class="h-72 flex justify-center bg-gray-100"
        >
          <nuxt-img
            :src="product?.productimage_set[0].image"
            style="object-fit: cover;"
          />
        </div>
        <div class="card-body gap-5">
          <div class="flex-1 flex justify-between">
            <div class="w-full flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <div class="mb-2 text-xl text-gray-600 font-normal dark:text-white line-clamp-1">{{ capitalizeOnlyFirstLetter($t(product.title))}}</div>
                <div v-if="product?.rating_count">
                  <RatingPreview
                    :rating-value="product?.average_rating || 0"
                    :rating-count="product?.rating_count || 0"
                  />
                </div>
                <div
                  v-else
                  class="text-sm italic text-gray-500"
                >
                  {{ capitalizeOnlyFirstLetter($t('no_ratings_yet')) }}
                </div>
              </div>
              <p class="text-sm text-gray-500 font-normal dark:text-white line-clamp-2 mt-1">{{ capitalizeOnlyFirstLetter($t(product.description))}}</p>
            </div>
          </div>

          <div
            v-if="product.starting_price"
            class="flex gap-0.5 justify-end items-start"
          >
            <div class="text-lg text-gray-500 mt-1 mr-2">{{ capitalizeOnlyFirstLetter($t('from')) }}</div>
            <div class="text-2xl text-gray-800 dark:text-white">€{{product.starting_price}}</div>
            <div class="text-gray-800">00</div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>

</template>
    
    <script lang="ts" setup>
const { product } = defineProps(["product"]); // props
</script>
    
<style>
</style>