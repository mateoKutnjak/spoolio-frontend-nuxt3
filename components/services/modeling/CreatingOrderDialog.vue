<template>
  <div class="flex flex-col gap-6 p-3 justify-between items-start">
    <div
      v-if="everythingSuccessful"
      class="flex gap-3 items-center"
    >
      <Icon
        name="ph:check-circle-fill"
        size="40"
        class="text-primary"
      />
      <div class="text-2xl font-bold uppercase">Upit uspješno poslan</div>
    </div>
    <div v-if="everythingSuccessful">
      Vaš upit će biti pregledan unutar par dana te ćemo Vam se javiti na kontakt e-mail adresu sa ponudom.
    </div>
    <div v-show="everythingSuccessful && !isLoggedIn">Napravite svoj račun kako bi mogli jednostavno pratiti otvorene upite i narudžbe.</div>
    <div
      v-if="!everythingSuccessful"
      class="flex flex-col gap-4"
    >
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
        <div class="text-2xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('creating_order')) }}</div>
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
        <div class="text-2xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('uploading_files')) }} ({{ attachmentsUploadedCount }}/{{  attachmentFiles.length }})</div>
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
        <div class="text-2xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('uploading_images')) }} ({{ attachmentsImagesUploadedCount }}/{{  attachmentImages.length }})</div>
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
    <!-- <div
      v-show="everythingSuccessful"
      class="text-lg text-center text-gray-600"
    >{{ capitalizeOnlyFirstLetter($t('your_order_has_been_placed')) }}. {{ capitalizeOnlyFirstLetter($t('we_will_contact_you_as_soon_as_possible')) }}.</div> -->
    <div
      v-show="everythingSuccessful"
      class="w-full flex flex-col gap-2"
    >
      <div
        v-show="everythingSuccessful && !isLoggedIn"
        class="
          btn btn-block btn-primary rounded-md
          text-xl hover:!text-white"
        :class="everythingSuccessful ? '': 'btn-disabled'"
        @click="onSignUpPressed"
      >{{ capitalizeOnlyFirstLetter($t('sign_up')) }}</div>
      <div
        v-show="everythingSuccessful"
        class="
          btn btn-block btn-outline btn-primary rounded-md
          text-xl hover:!text-white"
        :class="everythingSuccessful ? '': 'btn-disabled'"
        @click="onOkPressed"
      >{{ capitalizeOnlyFirstLetter($t('close')) }}</div>
      <div
        v-show="hasErrors"
        class="
          btn btn-block
          text-xl
          "
        @click="onReturnPressed"
      >{{ capitalizeOnlyFirstLetter($t('return')) }}</div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import {
  IAttachmentFile,
  IAttachmentImage,
  IModelingOrder,
} from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useModelingOrderStore } from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";

const localePath = useLocalePath();

const authStore = useAuthStore();
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

const isLoggedIn = computed(() => authStore.loggedIn);

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

var rootOrderResult: IModelingOrder;

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 1000));

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
  navigateTo(localePath("/"));
}

function onReturnPressed() {
  dialogStore.close();
}

function closeAuth(){
  navigateTo(localePath("/"));
}

function onSignUpPressed() {
  dialogStore.close();
  // navigateTo(localePath("/"));
  dialogStore.openEmits("AuthForm", {orderId: rootOrderResult.id, orderType: "modeling"}, undefined, "md", true, closeAuth);
}
</script>
  
  <style>
</style>