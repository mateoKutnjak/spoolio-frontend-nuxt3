<template>
  <div
    class="btn btn-ghost border-gray-300 text-start text-base justify-start px-7 pl-4 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="onClicked"
  >
    <div
      class="w-full"
      v-if="paymentMethod && Object.keys(paymentMethod).length"
    >
      <div class="flex gap-3 font-normal">
        <Icon
          name="noto-v1:credit-card"
          size="26"
        />
        <div>{{paymentMethod}}</div>
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-normal text-gray-500">
        <Icon
          name="material-symbols:add"
          size="20"
        />
        Add payment method
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";
import { useNotificationStore } from "~~/stores/notification";

const cartStore = useCartStore();
const notificationStore = useNotificationStore();

const { paymentMethod } = storeToRefs(cartStore);

onMounted(() => {
  paymentMethod.value = "Credit card";
});

function onClicked() {
  notificationStore.show(
    "No other options available currently",
    ToastLevel.info()
  );
}
</script>

<style>
</style>