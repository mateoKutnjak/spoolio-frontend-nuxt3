<template>
  <div class="hidden md:block rounded-xl bg-white p-3">
    <table class="table-auto w-full">
      <thead class="rounded-lg">
        <tr class="bg-base-200">
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Id</th>
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Order date</th>
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Contact email</th>
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Price</th>
          <th class="px-8 pt-4 pb-3 text-end text-xs uppercase">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="w-full hover:bg-base-200/[0.3]"
          v-for="order in modeling_orders"
          :key="order.id"
        >
          <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{order.id}}</td>
          <td class="px-4 pt-4 pb-3 text-sm">{{ reformatDate(order.created_at)}}</td>
          <td class="px-4 pt-4 pb-3 text-sm ">{{ order.contact_email }} </td>
          <td class="px-4 pt-4 pb-3 text-sm ">- </td>
          <td class="px-4 pt-4 pb-3 text-end">
            <div class="btn btn-ghost btn-sm bg-blue-100 text-blue-500 px-5">In progress</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="md:hidden flex flex-col gap-3">
    <div
      class="card w-full rounded-none sm:rounded-xl bg-white p-3"
      v-for="order in modeling_orders"
      :key="order.id"
    >
      <div class="card-body p-4 gap-6">
        <div class="card-title gap-4">
          <div class="text-sm font-mono font-bold link link-info">#{{order.id}}</div>
          <div class="text-sm font-medium text-gray-400">{{ reformatDate(order.created_at)}}</div>
          <div class="btn btn-ghost btn-sm bg-blue-100 text-blue-500 font-medium px-3">In progress</div>
        </div>
        <div class="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, tempore quod ipsam deserunt cumque asperiores delectus aliquid nostrum distinctio ullam magni suscipit facere iure aliquam ut nulla esse, sint sunt.</div>
        <div class="text-gray-700 font-bold">$200</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const { modeling_orders } = storeToRefs(modelingOrderHistoryStore);

modelingOrderHistoryStore.fetchPaginated();
</script>

<style>
table th:first-child {
  border-radius: 10px 0 0 0px;
}

table th:last-child {
  border-radius: 0 10px 0px 0;
}
</style>