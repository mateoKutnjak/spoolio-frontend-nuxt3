<template>
  <div class="flex flex-col gap-16 p-12 justify-between items-center">
    <div class="card-title justify-center text-3xl">Your modeling order</div>
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
        <div class="text-2xl text-gray-700">Creating order</div>
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
        <div class="text-2xl text-gray-700">Uploading files ({{ attachmentsUploadedCount }}/{{  attachmentFiles.length }})</div>
      </div>
      <div class="flex gap-8 items-center">
        <div class="h-14 w-14">
          <Icon
            v-show="attachmentsImagesStatus === OrderStatus.progress"
            class="absolute h-14 w-14 text-gray-500"
            name="eos-icons:three-dots-loading"
          />
          <TransitionRoot
            appear
            :show="attachmentsImagesStatus === OrderStatus.success || attachmentsImagesStatus === OrderStatus.error"
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
              :class="attachmentsImagesStatus === OrderStatus.success ? `text-green-700` : `text-red-700`"
            >
              <Icon
                class="h-14 w-14"
                :name="attachmentsImagesStatus === OrderStatus.success ? `ph:check-circle-duotone` : `ph:x-circle-duotone`"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-2xl text-gray-700">Uploading images ({{ attachmentsImagesUploadedCount }}/{{  attachmentImages.length }})</div>
      </div>
    </div>

    <div
      v-show="hasErrors"
      class="flex gap-2 items-end
      text-xl text-center text-red-600 font-bold"
    >
      <Icon
        name="material-symbols:warning-rounded"
        class="text-red-500"
        size="30"
      />
      <div>{{ errorMessage }}</div>
    </div>
    <div
      v-show="everythingSuccessful"
      class="text-lg text-center text-gray-600"
    >Your modeling order has been created. We will contact you as soon as possible.</div>
    <div
      v-show="everythingSuccessful"
      class="
      btn
      btn-lg btn-block
      text-xl"
      :class="everythingSuccessful ? '': 'btn-disabled'"
      @click="onOkPressed"
    >Ok</div>
    <div
      v-show="hasErrors"
      class="
      btn
      btn-lg btn-block
      text-xl
      "
      @click="onReturnPressed"
    >Return</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { IAttachmentFile, IAttachmentImage, IModelingOrder } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import {
  useModelingOrderStore,
} from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";

const dialogStore = useDialogStore();
const modelingOrderStore = useModelingOrderStore();
const notificationStore = useNotificationStore();

const { attachmentFiles, attachmentImages } = storeToRefs(modelingOrderStore);

enum OrderStatus {
  initial,
  progress,
  success,
  error,
}

const orderStatus = ref(OrderStatus.initial);
const attachmentsStatus = ref(OrderStatus.initial);
const attachmentsImagesStatus = ref(OrderStatus.initial);

const attachmentsUploadedCount = ref(0);
const attachmentsImagesUploadedCount = ref(0);

const errorMessage = ref("");

const hasErrors = computed(() => {
  return [
    orderStatus.value,
    attachmentsStatus.value,
    attachmentsImagesStatus.value,
  ].find((el) => el === OrderStatus.error);
});

const everythingSuccessful = computed(() => {
  return (
    orderStatus.value === OrderStatus.success &&
    attachmentsStatus.value === OrderStatus.success &&
    attachmentsImagesStatus.value === OrderStatus.success
  );
});

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 1000));

  var rootOrderResult: IModelingOrder;
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
    notificationStore.showFetchError(error);
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

    const attachmentFile = modelingOrderStore.getAttachmentFiles[index];
    var attachmentFileResult: IAttachmentFile;

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
      notificationStore.showFetchError(error);
      return;
    }

    attachmentsUploadedCount.value++;

    console.log("DONE result_id = " + attachmentFileResult.id);
  }
  attachmentsStatus.value = OrderStatus.success;

  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------

  attachmentsImagesStatus.value = OrderStatus.progress;
  for (
    let index = 0;
    index < modelingOrderStore.getAttachmentImages.length;
    index++
  ) {

    const attachmentImage = modelingOrderStore.getAttachmentImages[index];
    var attachmentImageResult: IAttachmentImage;

    try {
      attachmentImageResult = await modelingOrderStore.postAttachmentImage(
        attachmentImage,
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
      notificationStore.showFetchError(error);
      return;
    }

    attachmentsImagesUploadedCount.value++;

    console.log("DONE result_id = " + attachmentImageResult.id);
  }
  attachmentsImagesStatus.value = OrderStatus.success;
});

function onOkPressed() {
  dialogStore.close();
  modelingOrderStore.clear();
  navigateTo("/blogs");
}

function onReturnPressed() {
  dialogStore.close();
}
</script>
  
  <style>
</style>