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
        <div class="text-3xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('creating_order')) }}</div>
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
    >{{ capitalizeOnlyFirstLetter($t('your_order_has_been_placed')) }} {{ capitalizeOnlyFirstLetter($t('redirecting_you_to_payment_service')) }}</div>
    <div
      v-show="orderStatus === OrderStatus.error"
      class="
      btn
      btn-lg
      text-xl"
      @click="onReturnPressed"
    >{{ capitalizeOnlyFirstLetter($t('return')) }}</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { IStoreOrder } from "~~/constants/data";
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const {t} = useI18n();

const cartStore = useCartStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { store_order } = storeToRefs(cartStore);

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

  var rootOrderResult: IStoreOrder;
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
    notificationStore.showFetchError(error);
    return;
  }

  console.log("Order created");
  console.log(rootOrderResult);
});

function onOkPressed() {
  dialogStore.close();
  cartStore.clear();
  navigateTo("/blogs");
}

function onReturnPressed() {
  dialogStore.close();
}

watch(orderStatus, async (value) => {
  if (value === OrderStatus.success) {
    await new Promise((r) => setTimeout(r, 2500));

    if (!store_order.value.id) {
      console.error(
        "Store order ID is null when trying to redirect to payment"
      );
      capitalizeOnlyFirstLetter(t('please_proceed_with_payment_through_order_history'))
      return;
    }

    dialogStore.close();
    navigateTo(`/payment/store/${store_order.value.id}`);
  }
});
</script>
  
  <style>
</style>