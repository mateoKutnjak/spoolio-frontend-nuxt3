<template>
  <div class="card compact px-3 pt-1 bg-base-100 rounded shadow border border-gray-400">
    <div class="card-body gap-4">
      <div class="card-title text-base text-gray-400 font-normal items-start">
        <Icon
          name="lucide:receipt"
          size="22"
        />
        <div>{{ capitalizeOnlyFirstLetter($t('receipt')) }}</div>
      </div>
      <!-- <div class="flex flex-col gap-1 text-start text-base text-gray-600">
          <p class="font-bold">{{billingAddress.first_name}} {{billingAddress.last_name}}</p>
          <p>{{billingAddress.address}} </p>
          <p>{{billingAddress.locality}} {{billingAddress.postal_code}}</p>
          <p>{{billingAddress.country}}</p>
          <p>{{billingAddress.phone_number}}</p>
        </div> -->
      <table class="table table-xs">
        <tbody class="text-start text-stone-600">
          <tr>
            <td class="text-base">{{ capitalizeOnlyFirstLetter($t('price')) }}</td>
            <td class="text-base">{{ Number(order.estimated_price).toFixed(2) }} €</td>
          </tr>
          <tr>
            <td class="text-base">{{ $t('tax').toUpperCase() }}</td>
            <td class="text-base">{{ (order.estimated_price * TAX_FRACTION).toFixed(2) }} €</td>
          </tr>
          <tr>
            <td class="text-base">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
            <td class="text-base">{{ Number(order.shipping_method.price).toFixed(2) }} €</td>
          </tr>
          <tr class="border-t border-t-stone-500">
            <th class="text-start text-base">{{ capitalizeOnlyFirstLetter($t('total_price')) }}</th>
            <th class="text-start text-base">{{ (order.estimated_price * (1 + TAX_FRACTION) + Number(order.shipping_method.price)).toFixed(2) }} €</th>
          </tr>
        </tbody>
      </table>
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