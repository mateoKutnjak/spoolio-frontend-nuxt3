<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded border border-stone-400/80">
    <div class="card-body gap-4">
      <div class="card-title text-xl text-gray-400 font-semibold items-start">
        <Icon
          name="ph:credit-card-fill"
          size="22"
        />
        <div>{{ capitalizeOnlyFirstLetter($t('billing_address')) }}</div>
      </div>
      <div class="flex flex-col text-start text-lg text-stone-600">
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