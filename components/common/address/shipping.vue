<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded border border-stone-400/80">
    <div class="card-body gap-4">
      <div class="card-title text-xl text-gray-400 font-semibold items-start">
        <Icon
          name="ph:package-fill"
          size="22"
        />
        <div>{{ capitalizeOnlyFirstLetter($t('shipping_address')) }}</div>
      </div>
      <div class="flex flex-col text-start text-lg text-stone-600">
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