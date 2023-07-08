<template>
  <tr class="w-full hover:bg-base-200/[0.3]">
    <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{order?.id}}</td>
    <td class="px-4 pt-4 pb-3 text-lg">{{ reformatDate(order?.created_at)}}</td>
    <td class="px-4 pt-4 pb-3 text-lg text-center">
      <div
        class="dropdown dropdown-end"
        @click.stop
      >
        <label
          tabindex="0"
          class="btn btn-circle btn-ghost btn-sm text-info"
        >
          <Icon
            name="ph:info"
            size="20"
          />
        </label>
        <div
          tabindex="0"
          class="card dropdown-content shadow-md bg-base-100 rounded-box"
        >
          <div class="card-body">
            <div class="flex flex-col gap-6 items-start">
              <div>
                <div class="text-sm text-gray-500 text-start">{{ capitalizeOnlyFirstLetter($t('contact_email')) }}:</div>
                <strong>{{order?.contact_email}}</strong>
              </div>
              <div class="flex gap-8">
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">{{ capitalizeOnlyFirstLetter($t('shipping_address')) }}</div>
                  <div class="divider m-0"></div>
                  <strong>{{order?.shipping_address.first_name}} {{order?.shipping_address.last_name}}</strong>
                  <p class="font-normal">{{order?.shipping_address.address}} </p>
                  <p class="font-normal">{{order?.shipping_address.locality}} {{order?.shipping_address.postal_code}}</p>
                  <p class="font-normal">{{order?.shipping_address.country}}</p>
                  <p class="font-normal">{{order?.shipping_address.phone_number}}</p>
                </div>
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">{{ capitalizeOnlyFirstLetter($t('billing_address')) }}</div>
                  <div class="divider m-0"></div>
                  <strong>{{order?.billing_address.first_name}} {{order?.billing_address.last_name}}</strong>
                  <p class="font-normal">{{order?.billing_address.address}}</p>
                  <p class="font-normal">{{order?.billing_address.locality}} {{order?.billing_address.postal_code}}</p>
                  <p class="font-normal">{{order?.billing_address.country}}</p>
                  <p class="font-normal">{{order?.billing_address.phone_number}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>

    <td class="px-4 pt-4 pb-3 text-lg font-bold ">€{{ total_price }}</td>
    <td class="px-4 pt-4 pb-3 text-end">
      <OrderStatusView :raw-status="order?.status" />
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";

const { orderId } = defineProps(["orderId"]);

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const order = storeOrderHistoryStore.getOrderById(orderId);

const total_price = computed(() => {
  if (!order?.total_price || !order?.shipping_method?.price) {
    return "-";
  }
  return (
    Number(order?.total_price) * (1 + TAX_FRACTION) +
    Number(order?.shipping_method.price)
  ).toFixed(2);
});
</script>

<style>
</style>