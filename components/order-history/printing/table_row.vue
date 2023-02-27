<template>
  <tr class="w-full hover:bg-base-200/[0.3]">
    <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{printOrder?.id}}</td>
    <td class="px-4 pt-4 pb-3 text-sm">{{ reformatDate(printOrder?.created_at)}}</td>
    <td class="px-4 pt-4 pb-3 text-sm text-center">
      <div class="dropdown dropdown-end">
        <label
          tabindex="0"
          class="btn btn-circle btn-ghost btn-sm text-info"
        >
          <Icon
            name="material-symbols:info-outline"
            size="18"
          />
        </label>
        <div
          tabindex="0"
          class="card dropdown-content shadow-md bg-base-100 rounded-box"
        >
          <div class="card-body">
            <div class="flex flex-col gap-6 items-start">
              <div>
                <div class="text-sm text-gray-500 text-start">Contact email:</div>
                <strong>{{printOrder?.contact_email}}</strong>
              </div>
              <div class="flex gap-8">
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">Shipping address</div>
                  <div class="divider m-0"></div>
                  <strong>{{printOrder?.shipping_address.first_name}} {{printOrder?.shipping_address.last_name}}</strong>
                  <p class="font-normal">{{printOrder?.shipping_address.address}} </p>
                  <p class="font-normal">{{printOrder?.shipping_address.locality}} {{printOrder?.shipping_address.postal_code}}</p>
                  <p class="font-normal">{{printOrder?.shipping_address.country}}</p>
                  <p class="font-normal">{{printOrder?.shipping_address.phone_number}}</p>
                </div>
                <div class="flex flex-col text-start text-base text-gray-800 w-32">
                  <div class="text-sm text-gray-500">Billing address</div>
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

    <td class="px-4 pt-4 pb-3 text-sm font-bold ">{{ printOrder?.estimated_price ? `$${printOrder.estimated_price}` : '-'}}</td>
    <td class="px-4 pt-4 pb-3 text-end">
      <div
        v-if="printOrder"
        class="btn btn-ghost btn-sm px-5 text-gray-700"
        :style="`background-color: ${ OrderStatus.all[printOrder.status].colorHex}`"
      >{{ OrderStatus.all[printOrder.status].display_name }}</div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { OrderStatus } from "~~/constants/constants";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { printOrderId } = defineProps(["printOrderId"]);

const printOrderHistoryStore = usePrintOrderHistoryStore();

const printOrder = printOrderHistoryStore.getPrintOrderById(printOrderId);
</script>

<style>
</style>