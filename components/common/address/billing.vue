<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded shadow border border-gray-400">
    <div class="card-body gap-4">
      <div class="card-title text-base text-gray-400 font-normal items-start">
        <Icon
          name="material-symbols:credit-card"
          size="22"
        />
        <div>Billing address</div>
      </div>
      <div class="flex flex-col gap-1 text-start text-base text-gray-600">
        <p class="font-bold">{{billingAddress.first_name}} {{billingAddress.last_name}}</p>
        <p>{{billingAddress.address}} </p>
        <p>{{billingAddress.locality}} {{billingAddress.postal_code}}</p>
        <p>{{billingAddress.country}}</p>
        <p>{{billingAddress.phone_number}}</p>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { IAddressBilling } from "~~/constants/data";

const { billingAddress } = defineProps<{
  billingAddress: IAddressBilling;
}>();
</script>
  
  <style>
</style>