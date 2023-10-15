<template>
  <div class="flex flex-col gap-12 p-4 justify-between">
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
      <div class="flex gap-8 items-center">
        <div class="h-14 w-14">
          <Icon
            v-show="unitsStatus === OrderStatus.progress"
            class="absolute h-14 w-14 text-gray-500"
            name="eos-icons:three-dots-loading"
          />
          <TransitionRoot
            appear
            :show="unitsStatus === OrderStatus.success || unitsStatus === OrderStatus.error"
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
              :class="unitsStatus === OrderStatus.success ? `text-green-700` : `text-red-700`"
            >
              <Icon
                class="h-14 w-14"
                :name="unitsStatus === OrderStatus.success ? `ph:check-circle-duotone` : `ph:x-circle-duotone`"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('uploading_models')) }} ({{ unitsUploadedCount }}/{{  units.length }})</div>
      </div>
      <!-- <div class="flex gap-8 items-center">
        <div class="h-14 w-14">
          <Icon
            v-show="attachmentsStatus === OrderStatus.progress"
            class="absolute h-14 w-14 text-gray-500"
            name="eos-icons:three-dots-loading"
          />
          <TransitionRoot
            appear
            :show="attachmentsStatus === OrderStatus.success || attachmentsStatus === OrderStatus.error"
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
              :class="attachmentsStatus === OrderStatus.success ? `text-green-700` : `text-red-700`"
            >
              <Icon
                class="h-14 w-14"
                :name="attachmentsStatus === OrderStatus.success ? `ph:check-circle-duotone` : `ph:x-circle-duotone`"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">Uploading attachments ({{ attachmentsUploadedCount }}/{{  attachmentFiles.length }})</div>
      </div> -->
    </div>
    <div
      v-show="orderStatus === OrderStatus.error || unitsStatus === OrderStatus.error"
      class="
      text-lg text-center text-gray-600"
    >{{ errorMessage }}</div>
    <div
      v-show="orderStatus === OrderStatus.success && unitsStatus === OrderStatus.success"
      class="text-lg text-center text-gray-600"
    >{{ capitalizeOnlyFirstLetter($t('your_order_has_been_placed')) }}</div>
    <div
      class="max-w-xl w-full flex flex-col md:flex-row gap-5 justify-center self-center"
      v-show="(orderStatus === OrderStatus.success && unitsStatus === OrderStatus.success) || orderStatus === OrderStatus.error || unitsStatus === OrderStatus.error"
    >
      <div
        class="flex-1 btn btn-primary text-xl"
        :class="orderStatus === OrderStatus.success && unitsStatus === OrderStatus.success  ? '': 'btn-disabled'"
        @click="onOkPressed"
      >{{ $t('pay_now').toUpperCase() }}</div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { IPrintOrder, IPrintOrderUnit } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const { t } = useI18n();
const localePath = useLocalePath();

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { print_order, units } = storeToRefs(printOrderStore);

const emit = defineEmits(['action']);

enum OrderStatus {
  initial,
  progress,
  success,
  error,
}

const orderStatus = ref(OrderStatus.initial);
const unitsStatus = ref(OrderStatus.initial);
// const attachmentsStatus = ref(OrderStatus.initial);

const unitsUploadedCount = ref(0);
// const attachmentsUploadedCount = ref(0);

const errorMessage = ref("");

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 1000));

  var rootOrderResult: IPrintOrder;
  try {
    rootOrderResult = await printOrderStore.postOrder();
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

  console.log("Empty modeling order created");
  console.log(rootOrderResult);

  // ------------------------------------------------
  // ---------------- UNITS UPLOAD ------------------
  // ------------------------------------------------
  unitsStatus.value = OrderStatus.progress;
  for (let index = 0; index < printOrderStore.getUnits.length; index++) {
    await new Promise((r) => setTimeout(r, 500));

    const unit = printOrderStore.getUnits[index];
    var unitResult: IPrintOrderUnit;

    try {
      unitResult = await printOrderStore.postOrderUnit(
        unit,
        rootOrderResult.id
      );
    } catch (error: any) {
      unitsStatus.value = OrderStatus.error;
      errorMessage.value =
        "Error (" +
        error.statusCode +
        "). Data = " +
        JSON.stringify(error.data) +
        ".";
      notificationStore.showFetchError(error);
      return;
    }

    unitsUploadedCount.value++;
    
    console.log("DONE result_id = " + unitResult.id);
  }
  if (unitsUploadedCount.value == units.value.length){
    printOrderStore.clearJobIds();
  }
  unitsStatus.value = OrderStatus.success;

  // ------------------------------------------------
  // ---------------- PAYMENT -----------------------
  // ------------------------------------------------

  console.log("Trying to emit makePayment")
  await emit('action', rootOrderResult.id);

});

function onOkPressed() {
  dialogStore.close();
  printOrderStore.clear();

  if (!print_order.value.id) {
    console.error("Print order ID is null when trying to redirect to payment");
    capitalizeOnlyFirstLetter(
      t("please_proceed_with_payment_through_order_history")
    );
    navigateTo(localePath("/"));
    return;
  }
  dialogStore.close();
  navigateTo(localePath(`/payment/printing/${print_order.value.id}`));
}

function onReturnPressed() {
  dialogStore.close();
  navigateTo(localePath("/"));
}
</script>
  
  <style>
</style>