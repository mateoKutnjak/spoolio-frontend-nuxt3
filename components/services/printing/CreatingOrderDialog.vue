<template>
  <div class="flex flex-col gap-16 p-12 justify-between">
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
        <div class="text-3xl text-gray-700">Uploading models ({{ unitsUploadedCount }}/{{  units.length }})</div>
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
    >Your order has been placed. Redirecting to payment service...</div>
    <div
      v-show="orderStatus === OrderStatus.success && unitsStatus === OrderStatus.success"
      class="
      btn
      btn-lg
      text-xl"
      :class="orderStatus === OrderStatus.success && unitsStatus === OrderStatus.success  ? '': 'btn-disabled'"
      @click="onOkPressed"
    >Ok</div>
    <div
      v-show="orderStatus === OrderStatus.error || unitsStatus === OrderStatus.error"
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
import { useDialogStore } from "~~/stores/dialog";
import { IModelingOrderAttachmentFileResponse } from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";
import {
  IPrintOrderAttachmentFileResponse,
  IPrintOrderResponse,
  IPrintOrderUnitResponse,
  usePrintOrderStore,
} from "~~/stores/print_order";

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { attachmentFiles, units } = storeToRefs(printOrderStore);

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

  var rootOrderResult: IPrintOrderResponse;
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
    console.log(
      "Posting unit file " + printOrderStore.getUnits[index].file.name
    );

    await new Promise((r) => setTimeout(r, 500));

    const unit = printOrderStore.getUnits[index];
    var unitResult: IPrintOrderUnitResponse;

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
  unitsStatus.value = OrderStatus.success;
});

function onOkPressed() {
  dialogStore.close();
  printOrderStore.clear();
  navigateTo("/");
}

function onReturnPressed() {
  dialogStore.close();
}
</script>
  
  <style>
</style>