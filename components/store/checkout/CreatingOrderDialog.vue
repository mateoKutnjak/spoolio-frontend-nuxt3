<template>
  <div class="flex flex-col gap-8 p-12 justify-between">
    <div class="flex flex-col gap-4">
      <div class="flex gap-8 items-center">
        <div class="h-14 w-14">
          <Icon
            v-show="orderStatus === OrderStatus.progress"
            class="absolute h-14 w-14 text-gray-500"
            name="eos-icons:three-dots-loading"
          />
          <TransitionRoot
            appear
            :show="orderStatus === OrderStatus.success || orderStatus === OrderStatus.error"
            as="template"
            enter="transform transition duration-[400ms]"
            enter-from="opacity-0 rotate-[-120deg] scale-50"
            enter-to="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leave-from="opacity-100 rotate-0 scale-100 "
            leave-to="opacity-0 scale-95 "
          >

            <div
              class="h-14 w-14 text-green-700"
              :class="orderStatus === OrderStatus.success ? `text-green-700` : `text-red-700`"
            >
              <Icon
                class="h-14 w-14"
                :name="orderStatus === OrderStatus.success ? `ph:check-circle-duotone` : `ph:x-circle-duotone`"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">Creating order</div>
      </div>
    </div>
    <div
      v-show="orderStatus === OrderStatus.error"
      class="
      text-lg text-center text-gray-600"
    >{{ errorMessage }}</div>
    <div
      v-show="orderStatus === OrderStatus.success"
      class="text-lg text-center text-gray-600"
    >Your order has been placed. Redirecting to payment service...</div>
    <div
      v-show="orderStatus === OrderStatus.success"
      class="
      btn
      btn-lg
      text-xl"
      :class="orderStatus === OrderStatus.success  ? '': 'btn-disabled'"
      @click="onOkPressed"
    >Ok</div>
    <div
      v-show="orderStatus === OrderStatus.error"
      class="
      btn
      btn-lg
      text-xl"
      @click="onReturnPressed"
    >Return</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { IStoreOrderResponse, useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const cartStore = useCartStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { cartItems } = storeToRefs(cartStore);

enum OrderStatus {
  initial,
  progress,
  success,
  error,
}

const orderStatus = ref(OrderStatus.initial);

const errorMessage = ref("");

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 1000));

  var rootOrderResult: IStoreOrderResponse;
  try {
    rootOrderResult = await cartStore.postOrder();
    orderStatus.value = OrderStatus.success;
  } catch (error: any) {
    orderStatus.value = OrderStatus.error;
    errorMessage.value =
      "Error (" +
      error.statusCode +
      "). Data = " +
      JSON.stringify(error.data) +
      ".";
    notificationStore.show(error.statusMessage, ToastLevel.error());
    return;
  }

  console.log("Order created");
  console.log(rootOrderResult);
});

function onOkPressed() {
  dialogStore.close();
  navigateTo("/");
}

function onReturnPressed() {
  dialogStore.close();
}
</script>
  
  <style>
</style>