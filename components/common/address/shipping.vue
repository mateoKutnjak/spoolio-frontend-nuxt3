<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded shadow border border-stone-400">
    <div class="card-body gap-4">
      <div class="card-title text-base text-gray-400 font-normal items-start">
        <Icon
          name="lucide:map-pin"
          size="22"
        />
        <div>{{ capitalizeOnlyFirstLetter($t('shipping_address')) }}</div>
      </div>
      <div class="flex flex-col gap-1 text-start text-base text-gray-600">
        <p class="font-bold">{{shippingAddress.first_name}} {{shippingAddress.last_name}}</p>
        <p>{{shippingAddress.address}} </p>
        <p>{{shippingAddress.locality}} {{shippingAddress.postal_code}}</p>
        <p>{{shippingAddress.country}}</p>
        <p>{{shippingAddress.phone_number}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IAddressShipping } from "~~/constants/data";

const { shippingAddress } = defineProps<{
  shippingAddress: IAddressShipping;
}>();
</script>

<style>
</style>