<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded shadow border border-gray-400">
    <div class="card-body gap-4 justify-between">
      <table class="table table-compact w-full">
        <tbody class="text-gray-600 ">
          <tr>
            <td class="pl-0 py-1 pb-0 text-base text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('items_price')) }}</td>
            <td class="py-1 pb-0 text-base text-end bg-transparent">€{{ (Number(order.estimated_price)).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{`${$t('tax').toUpperCase()} (${TAX_FRACTION * 100}%)`}}</td>
            <td class="py-1 pb-0 text-base border-transparent text-end bg-transparent">€{{ (Number(order.estimated_price) * TAX_FRACTION).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-1 pt-0 text-base border-b-1 border-gray-500 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
            <td class="py-1 pt-0 text-base border-b-1 border-gray-500 text-end bg-transparent">€{{ Number(order?.shipping_method?.price).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
              <div class="flex gap-1"><strong>{{ $t('total_price').toUpperCase() }}</strong></div>
            </td>
            <td class="py-2 text-base text-end border-transparent bg-transparent"> <strong>€{{ (Number(order.estimated_price) * (1+TAX_FRACTION) + Number(order?.shipping_method?.price)).toFixed(2) }}</strong></td>
          </tr>
        </tbody>
      </table>
      <NuxtLink
        :to="`/payment/printing/${order.id}`"
        class="btn btn-primary btn-block btn-l"
      >
      {{ $t('pay_now').toUpperCase() }}
      </NuxtLink>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { IPrintOrder } from "~~/constants/data";

const { order } = defineProps<{
  order: IPrintOrder;
}>();
</script>
  
  <style>
</style>