<template>
  <div class="container p-12 mx-auto">
    <div class="flex flex-col gap-8">
      <div class="px-6 lg:px-0 flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-start md:items-end">
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
        <div class="mb-2 form-control">
          <label class="label">
            <span class="label-text">Your request</span>
          </label>
          <textarea
            class="textarea input-bordered"
            :placeholder="order.comment"
            readonly
          ></textarea>
        </div>
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
              :href="extractFilenameFileStringUnion(attachmentFile.file)"
            >{{ extractFilenameFileStringUnion(attachmentFile.file) }}</a>
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
              :href="extractFilenameFileStringUnion(attachmentImage.image)"
            >{{ extractFilenameFileStringUnion(attachmentImage.image) }}</a>
          </div>
        </div>
      </div>
      <div v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment && order.estimated_price">
        <NuxtLink
          :to="`/payment/modeling/${order.id}`"
          class="btn btn-primary btn-block btn-lg"
        >
          Pay Now ({{ order.estimated_price }} €)
        </NuxtLink>
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
    urlExtractFileSuffix(extractFilenameFileStringUnion(obj))
  );
}
</script>
  
  <style>
</style>