<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded border border-stone-400/80">
    <div class="card-body gap-4 justify-between">
      <div class="card-title text-xl text-gray-400 font-semibold items-start">
        <Icon
          name="ph:receipt-fill"
          size="22"
        />
        <div>{{ capitalizeOnlyFirstLetter($t('receipt')) }}</div>
      </div>
      <table class="table table-compact w-full text-xl">
        <tbody class="text-gray-600 ">
          <tr>
            <td class="pl-0 py-1 pb-0 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('items_price')) }}</td>
            <td class="py-1 pb-0 text-end bg-transparent">€{{ (Number(order.estimated_price)).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-1 pb-0 border-transparent text-start bg-transparent">{{`${$t('tax').toUpperCase()} (${TAX_FRACTION * 100}%)`}}</td>
            <td class="py-1 pb-0 border-transparent text-end bg-transparent">€{{ (Number(order.estimated_price) * TAX_FRACTION).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-1 pt-0 border-b-1 border-gray-500 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
            <td class="py-1 pt-0 border-b-1 border-gray-500 text-end bg-transparent">€{{ Number(order?.shipping_method?.price).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="pl-0 py-2 text-2xl text-start border-transparent bg-transparent">
              <div class="flex gap-1"><strong>{{ $t('total_price').toUpperCase() }}</strong></div>
            </td>
            <td class="py-2 text-2xl text-end border-transparent bg-transparent"> <strong>€{{ (Number(order.estimated_price) * (1+TAX_FRACTION) + Number(order?.shipping_method?.price)).toFixed(2) }}</strong></td>
          </tr>
        </tbody>
      </table>
      <NuxtLink
        v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
        :to="localePath(`/payment/printing/${order.id}`)"
        class="btn btn-primary btn-block btn-l"
      >
        {{ $t('pay_now').toUpperCase() }}
      </NuxtLink>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { OrderStatus, TAX_FRACTION } from "~~/constants/constants";
import { IPrintOrder } from "~~/constants/data";

const { order } = defineProps<{
  order: IPrintOrder;
}>();
</script>
  
  <style>
</style>