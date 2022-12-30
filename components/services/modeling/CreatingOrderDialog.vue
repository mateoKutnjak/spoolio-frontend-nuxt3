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
            :show="orderStatus === OrderStatus.success"
            as="template"
            enter="transform transition duration-[400ms]"
            enter-from="opacity-0 rotate-[-120deg] scale-50"
            enter-to="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leave-from="opacity-100 rotate-0 scale-100 "
            leave-to="opacity-0 scale-95 "
          >

            <div class="h-14 w-14 text-green-700">
              <Icon
                class="h-14 w-14"
                name="ph:check-circle-duotone"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">Creating order</div>
      </div>
      <div class="flex gap-8 items-center">
        <div class="h-14 w-14">
          <Icon
            v-show="attachmentsUploadedCount < attachmentFiles.length"
            class="absolute h-14 w-14 text-gray-500"
            name="eos-icons:three-dots-loading"
          />
          <TransitionRoot
            appear
            :show="orderStatus === OrderStatus.success && attachmentsUploadedCount === attachmentFiles.length"
            as="template"
            enter="transform transition duration-[400ms]"
            enter-from="opacity-0 rotate-[-120deg] scale-50"
            enter-to="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leave-from="opacity-100 rotate-0 scale-100 "
            leave-to="opacity-0 scale-95 "
          >

            <div class="h-14 w-14 text-green-700">
              <Icon
                class="h-14 w-14"
                name="ph:check-circle-duotone"
              />
            </div>
          </TransitionRoot>
        </div>
        <div class="text-3xl text-gray-700">Uploading attachments ({{ attachmentsUploadedCount }}/{{  attachmentFiles.length }})</div>
      </div>
    </div>
    <div
      v-show="orderStatus === OrderStatus.success && attachmentsUploadedCount === attachmentFiles.length"
      class="
      text-lg text-center text-gray-600"
    >Your modeling request has been sent. We will contact you as soon as possible.</div>
    <div
      class="btn btn-lg text-xl"
      :class="orderStatus === OrderStatus.success && attachmentsUploadedCount === attachmentFiles.length ? '': 'btn-disabled'"
      @click="onOkPressed"
    >Ok</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useDialogStore } from "~~/stores/dialog";
import { useModelingOrderStore } from "~~/stores/modeling_order";

const dialogStore = useDialogStore();
const modelingOrderStore = useModelingOrderStore();

const { attachmentFiles } = storeToRefs(modelingOrderStore);

enum OrderStatus {
  initial,
  progress,
  success,
  error,
}

const orderStatus = ref(OrderStatus.initial);
const attachmentsUploadedCount = ref(0);

onMounted(async () => {
  orderStatus.value = OrderStatus.progress;

  await new Promise((r) => setTimeout(r, 2000));

  const rootOrderResult = await modelingOrderStore.postOrder();

  // * TODO handle error

  orderStatus.value = OrderStatus.success;

  console.log("Empty modeling order created");
  console.log(rootOrderResult);

  for (
    let index = 0;
    index < modelingOrderStore.getAttachmentFiles.length;
    index++
  ) {
    console.log(
      "Posting attachment file " +
        modelingOrderStore.getAttachmentFiles[index].file.name
    );

    await new Promise((r) => setTimeout(r, 2000));

    const attachmentFile = modelingOrderStore.getAttachmentFiles[index];
    const attachmentFileResult = await modelingOrderStore.postAttachmentFile(
      attachmentFile,
      rootOrderResult.id
    );

    // TODO handle error

    attachmentsUploadedCount.value++;

    console.log("DONE result_id = " + attachmentFileResult.id);
  }
});

function onOkPressed() {
  dialogStore.close();
  navigateTo("/");
}
</script>
  
  <style>
</style>