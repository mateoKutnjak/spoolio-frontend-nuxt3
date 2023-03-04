<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded shadow border border-gray-400">
    <div class="card-body gap-4">
      <div class="card-title text-base text-gray-400 font-normal items-start">
        <Icon
          name="material-symbols:location-on"
          size="22"
        />
        <div>Shipping address</div>
      </div>
      <div class="flex flex-col gap-1 text-start text-base text-gray-600">
        <p class="font-medium">{{shippingAddress.first_name}} {{shippingAddress.last_name}}</p>
        <p class="font-light">{{shippingAddress.address}} </p>
        <p class="font-light">{{shippingAddress.locality}} {{shippingAddress.postal_code}}</p>
        <p class="font-light">{{shippingAddress.country}}</p>
        <p class="font-light">{{shippingAddress.phone_number}}</p>
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