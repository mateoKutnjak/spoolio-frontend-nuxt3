<template>
  <div class="card bg-base-100 rounded-none sm:rounded-lg shadow">
    <div class="card-body gap-5">
      <div class="flex flex-col gap-5">
        <div class="flex gap-4 justify-between items-center">
          <div class="flex gap-3 items-center">
            <div class="text-xl text-gray-700">{{ capitalizeOnlyFirstLetter($t(storeOrderUnit.item.product.title)) }}</div>
            <div class="text-sm">
              [ <NuxtLink
                to="/store"
                class="link link-info"
              >{{ capitalizeOnlyFirstLetter($t(storeOrderUnit.item.product.category.name)) }}</NuxtLink> / <NuxtLink
                to="/store"
                class="link link-info"
              >{{ capitalizeOnlyFirstLetter($t(storeOrderUnit.item.product.subcategory.name)) }}</NuxtLink> ]
            </div>
          </div>
          <RatingPreview
            :rating-value="storeOrderUnit.item.product?.average_rating || 0"
            :rating-count="storeOrderUnit.item.product?.rating_count || 0"
          />
        </div>
        <div class="text-sm font-base text-gray-700">{{ storeOrderUnit.item.product.description }}</div>
      </div>
      <div class="card-actions gap-4 justify-between items-center">
        <div class="flex gap-2">
          <AttributeItem
            v-for="option in storeOrderUnit.item.options"
            :key="option.id"
            :title="capitalizeOnlyFirstLetter($t(option.title))"
            :tooltip="capitalizeOnlyFirstLetter($t(option.description))"
          />
        </div>
        <div class="flex gap-3 items-center">
          <div class="text-gray-600">{{ capitalizeOnlyFirstLetter($t('quantity')) }}</div>
          <input
            type="number"
            class="bg-gray-50 w-14 h-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="storeOrderUnit.quantity.toString()"
            readonly
            disabled
          />
          <div class="ml-5 text-2xl">{{ storeOrderUnit.item.price * storeOrderUnit.quantity }} €</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IStoreOrderUnit } from "~~/constants/data";

const { storeOrderUnit } = defineProps<{
  storeOrderUnit: IStoreOrderUnit;
}>();
</script>

<style>
</style>