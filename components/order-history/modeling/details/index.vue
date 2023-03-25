<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-8">
      <div class="px-6 lg:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-3xl font-light">Modeling order #{{ order.id }}</div>
        <div class="text-xl font-light text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div class="px-6 lg:px-0">
        <div class="mb-2 form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Contact email</span>
          </label>
          <input
            class="input input-bordered input-md w-full max-w-xs"
            readonly
            :placeholder="order.contact_email"
          />
        </div>
        <div class="mb-4 lg:mb-12 form-control">
          <label class="label">
            <span class="label-text">Your request</span>
          </label>
          <textarea
            class="textarea input-bordered"
            :placeholder="order.comment"
            readonly
          ></textarea>
        </div>
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <div class="flex flex-col gap-1">
            <div
              v-if="attachment_files_data?.length"
              class="mb-2 form-control"
            >
              <label class="label">
                <span class="label-text">Attachment files</span>
              </label>
              <div
                class="flex gap-2 text-gray-500 items-center"
                v-for="attachmentFile in attachment_files_data"
                :key="attachmentFile.id"
              >
                <Icon
                  :name="iconName(attachmentFile.file)"
                  size="30"
                />
                <a
                  class="link link-info"
                  :href="extractUrlFileStringUnion(attachmentFile.file)"
                >{{ urlExtractFilename(extractUrlFileStringUnion(attachmentFile.file)) }}</a>
              </div>
            </div>
            <div
              v-if="attachment_images_data?.length"
              class="mb-2 form-control"
            >
              <label class="label">
                <span class="label-text">Attachment images</span>
              </label>
              <div
                class="flex gap-2 text-gray-500 items-center"
                v-for="attachmentImage in attachment_images_data"
                :key="attachmentImage.id"
              >
                <Icon
                  :name="iconName(attachmentImage.image)"
                  size="30"
                />
                <a
                  class="link link-info"
                  :href="extractUrlFileStringUnion(attachmentImage.image)"
                >{{ urlExtractFilename(extractUrlFileStringUnion(attachmentImage.image)) }}</a>
              </div>
            </div>
          </div>
          <OrderHistoryModelingDetailsCheckoutCard
            v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
            class="flex-1"
            :order="order"
          />
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";
import { IModelingOrder } from "~~/constants/data";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const { order } = defineProps<{
  order: IModelingOrder;
}>();

const {
  data: attachment_files_data,
  pending: attachment_files_pending,
  error: attachment_files_error,
  refresh: attachment_files_refresh,
} = useAsyncData("modeling_order_details_attachment_files", () =>
  modelingOrderHistoryStore.fetchAttachmentFilesById(order.id)
);

const {
  data: attachment_images_data,
  pending: attachment_images_pending,
  error: attachment_images_error,
  refresh: attachment_images_refresh,
} = useAsyncData("modeling_order_details_attachment_images", () =>
  modelingOrderHistoryStore.fetchAttachmentImagesById(order.id)
);

function iconName(obj: string | File) {
  return toIconNameByExtension(
    urlExtractFileSuffix(extractUrlFileStringUnion(obj))
  );
}
</script>
  
  <style>
</style>