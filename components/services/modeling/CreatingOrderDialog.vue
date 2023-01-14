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
              :class="orderStatus === OrderStatus.success ? `text-green-700` : `text-red-700`"
            >
              <Icon
                class="h-14 w-14"
                :name="orderStatus === OrderStatus.success ? `ph:check-circle-duotone` : `ph:x-circle-duotone`"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">Uploading attachments ({{ attachmentsUploadedCount }}/{{  attachmentFiles.length }})</div>
      </div>
    </div>
    <div
      v-show="orderStatus === OrderStatus.error || attachmentsStatus === OrderStatus.error"
      class="
      text-lg text-center text-gray-600"
    >{{ errorMessage }}</div>
    <div
      v-show="orderStatus === OrderStatus.success && attachmentsStatus === OrderStatus.success"
      class="text-lg text-center text-gray-600"
    >Your modeling request has been sent. We will contact you as soon as possible.</div>
    <div
      v-show="orderStatus === OrderStatus.success && attachmentsStatus === OrderStatus.success"
      class="
      btn
      btn-lg
      text-xl"
      :class="orderStatus === OrderStatus.success && attachmentsStatus === OrderStatus.success ? '': 'btn-disabled'"
      @click="onOkPressed"
    >Ok</div>
    <div
      v-show="orderStatus === OrderStatus.error || attachmentsStatus === OrderStatus.error"
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
import {
  IModelingOrderAttachmentFileResponse,
  IModelingOrderResponse,
  useModelingOrderStore,
} from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";

const dialogStore = useDialogStore();
const modelingOrderStore = useModelingOrderStore();
const notificationStore = useNotificationStore();

const { attachmentFiles } = storeToRefs(modelingOrderStore);

enum OrderStatus {
  initial,
  progress,
  success,
  error,
}

const orderStatus = ref(OrderStatus.initial);
const attachmentsStatus = ref(OrderStatus.initial);

const attachmentsUploadedCount = ref(0);
const errorMessage = ref("");

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 1000));

  var rootOrderResult: IModelingOrderResponse;
  try {
    rootOrderResult = await modelingOrderStore.postOrder();
    orderStatus.value = OrderStatus.success;
  } catch (error: any) {
    orderStatus.value = OrderStatus.error;
    errorMessage.value =
      "Error (" +
      error.statusCode +
      "). Data = " +
      JSON.stringify(error.data) +
      ".";
      notificationStore.show(
        "Root order error" + error.statusMessage,
        ToastLevel.error()
      );
    return;
  }

  console.log("Empty modeling order created");
  console.log(rootOrderResult);

  attachmentsStatus.value = OrderStatus.progress;
  for (
    let index = 0;
    index < modelingOrderStore.getAttachmentFiles.length;
    index++
  ) {
    console.log(
      "Posting attachment file " +
        modelingOrderStore.getAttachmentFiles[index].file.name
    );

    const attachmentFile = modelingOrderStore.getAttachmentFiles[index];
    var attachmentFileResult: IModelingOrderAttachmentFileResponse;

    try {
      attachmentFileResult = await modelingOrderStore.postAttachmentFile(
        attachmentFile,
        rootOrderResult.id
      );
    } catch (error: any) {
      attachmentsStatus.value = OrderStatus.error;
      errorMessage.value =
        "Error (" +
        error.statusCode +
        "). Data = " +
        JSON.stringify(error.data) +
        ".";
      notificationStore.show(
        "Attachment file error" + error.statusMessage,
        ToastLevel.error()
      );
      return;
    }

    attachmentsUploadedCount.value++;

    console.log("DONE result_id = " + attachmentFileResult.id);
  }
  attachmentsStatus.value = OrderStatus.success;
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