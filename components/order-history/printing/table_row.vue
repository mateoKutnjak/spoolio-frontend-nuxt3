<template>
  <tr class="w-full hover:bg-base-200/[0.3]">
    <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{printOrder?.id}}</td>
    <td class="px-4 pt-4 pb-3 text-lg">{{ reformatDate(printOrder?.created_at)}}</td>
    <td class="px-4 pt-4 pb-3 text-lg text-center">
      <div
        class="dropdown dropdown-end"
        @click.stop
      >
        <label
          tabindex="0"
          class="btn btn-circle btn-ghost btn-sm text-info z-0"
        >
          <Icon
            name="ph:info"
            size="20"
          />
        </label>
        <div
          tabindex="0"
          class="card dropdown-content shadow-md bg-base-100 rounded-box z-10"
        >
          <div class="card-body">
            <div class="flex flex-col gap-6 items-start">
              <div>
                <div class="text-sm text-gray-500 text-start">{{ capitalizeOnlyFirstLetter($t('contact_email')) }}:</div>
                <strong>{{printOrder?.contact_email}}</strong>
              </div>
              <div class="flex gap-8">
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">{{ capitalizeOnlyFirstLetter($t('shipping_address')) }}</div>
                  <div class="divider m-0"></div>
                  <strong>{{printOrder?.shipping_address.first_name}} {{printOrder?.shipping_address.last_name}}</strong>
                  <p class="font-normal">{{printOrder?.shipping_address.address}} </p>
                  <p class="font-normal">{{printOrder?.shipping_address.locality}} {{printOrder?.shipping_address.postal_code}}</p>
                  <p class="font-normal">{{printOrder?.shipping_address.country}}</p>
                  <p class="font-normal">{{printOrder?.shipping_address.phone_number}}</p>
                </div>
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">{{ capitalizeOnlyFirstLetter($t('billing_address')) }}</div>
                  <div class="divider m-0"></div>
                  <strong>{{printOrder?.billing_address.first_name}} {{printOrder?.billing_address.last_name}}</strong>
                  <p class="font-normal">{{printOrder?.billing_address.address}}</p>
                  <p class="font-normal">{{printOrder?.billing_address.locality}} {{printOrder?.billing_address.postal_code}}</p>
                  <p class="font-normal">{{printOrder?.billing_address.country}}</p>
                  <p class="font-normal">{{printOrder?.billing_address.phone_number}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>

    <td class="px-4 pt-4 pb-3 text-lg font-bold ">€{{ total_price }}</td>
    <td class="px-4 pt-4 pb-3 text-end">
      <OrderStatusView :raw-status="printOrder?.status" />
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { printOrderId } = defineProps(["printOrderId"]);

const printOrderHistoryStore = usePrintOrderHistoryStore();

const printOrder = printOrderHistoryStore.getPrintOrderById(printOrderId);

const total_price = computed(() => {
  if (!printOrder?.estimated_price || !printOrder?.shipping_method?.price) {
    return "-";
  }
  return (
    Number(printOrder?.estimated_price) * (1 + TAX_FRACTION) +
    Number(printOrder?.shipping_method.price)
  ).toFixed(2);
});
</script>

<style>
</style>