<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-8">
      <div class="px-6 lg:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-3xl">{{ `${capitalizeOnlyFirstLetter($t('modeling_order'))} #${order.id}`}}</div>
        <div class="text-xl text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div class="px-6 lg:px-0">
        <ul class="space-y-8">
          <li class="flex gap-4 items-center text-stone-600">
            <Icon
              name="material-symbols:circle"
              size="12"
            />
            <span>{{ capitalizeOnlyFirstLetter($t('contact_email')) }}</span>
            <input
              class="input input-bordered input-sm w-full max-w-xs"
              readonly
              :placeholder="order.contact_email"
            />
          </li>
          <li class="flex gap-4 items-start text-stone-600">
            <Icon
              class="mt-1.5"
              name="material-symbols:circle"
              size="12"
            />
            <span>{{ capitalizeOnlyFirstLetter($t('description')) }}</span>
            <textarea
              class="textarea input-bordered w-full max-w-2xl"
              :placeholder="order.comment"
              readonly
            ></textarea>
          </li>
          <li class="flex gap-4 items-center text-stone-600">
            <Icon
              name="material-symbols:circle"
              size="12"
            />
            <OrderHistoryModelingDetailsItemType :item_type="order.item_type" />
          </li>
          <li class="flex gap-4 items-center text-stone-600">
            <Icon
              name="material-symbols:circle"
              size="12"
            />
            <OrderHistoryModelingDetailsItemAttributes :item_attributes="order.item_attributes" />
          </li>
          <li
            v-if="attachment_files_data?.length"
            class="flex gap-4 items-start text-stone-600"
          >
            <Icon
              class="mt-1.5"
              name="ph:paperclip"
              size="25"
            />
            <div>
              <label class="label">
                <span class="label-text">{{ capitalizeOnlyFirstLetter($t('attachment_files')) }}</span>
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
          </li>
        </ul>

      </div>
      <OrderHistoryModelingDetailsCheckoutCard
        v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
        class="w-min self-center"
        :order="order"
      />
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