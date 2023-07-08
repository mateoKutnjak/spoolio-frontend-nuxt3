<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-12">
      <div class="px-6 lg:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-4xl font-bold text-stone-600">{{ `${capitalizeOnlyFirstLetter($t('modeling_order'))} #${order.id}`}}</div>
        <div class="text-xl text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div class="px-6 lg:px-0">

        <div class="grid grid-cols-1 gap-4">

          <div class="flex flex-col gap-1">
            <div class="text-lg text-stone-500 font-semibold">{{ $t('type_of_modeling').toUpperCase() }}</div>
            <SelectSingleChoice
              v-if="order.order_type"
              :options="[order.order_type]"
              :preselect-option="order.order_type"
              :extract-id="(item: IModelingOrderOrderType) => item.id"
              :extract-title="(item: IModelingOrderOrderType) => capitalizeOnlyFirstLetter($t(item.name))"
              :extract-icon-name="(item: IModelingOrderOrderType) => item.icon_name"
              :enable-unselected-border="true"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-lg text-stone-500 font-semibold">{{ $t('item_type').toUpperCase() }}</div>
            <SelectSingleChoice
              :options="[order.item_type]"
              :preselect-option="order.item_type"
              :extract-id="(item: IModelingOrderItemType) => item.id"
              :extract-title="(item: IModelingOrderItemType) => capitalizeOnlyFirstLetter($t(item.name))"
              :extract-icon-name="(item: IModelingOrderItemType) => item.icon_name"
              :enable-unselected-border="true"
            />
          </div>

          <div class="flex flex-col gap-1">
            <div class="text-lg text-stone-500 font-semibold">{{ $t('item_attributes').toUpperCase() }}</div>
            <SelectMultiChoice
              class="btn-disabled"
              :options="order.item_attributes"
              :preselect-options="order.item_attributes"
              :extract-id="(option: IModelingOrderItemAttribute) => option.id"
              :extract-title="(option: IModelingOrderItemAttribute) => capitalizeOnlyFirstLetter($t(option.name))"
              :extract-description="(option: IModelingOrderItemAttribute) => capitalizeOnlyFirstLetter($t(option.description || ''))"
              @on-selection-change="l => itemAttributeSelectionChange(l)"
            />
          </div>

          <div class="divider"></div>

          <div class="flex flex-col gap-1">
            <div class="text-lg text-stone-500 font-semibold">{{ $t('contact_email').toUpperCase() }}</div>
            <input
              class="input input-bordered w-full max-w-sm"
              readonly
              :placeholder="order.contact_email"
            />
          </div>

          <div class="flex flex-col gap-1">
            <div class="text-lg text-stone-500 font-semibold">{{ $t('description').toUpperCase() }}</div>
            <textarea
              class="textarea text-base font-medium input-bordered w-full max-w-7xl"
              :placeholder="order.comment"
              readonly
            ></textarea>
          </div>

          <div class="divider"></div>

          <li
            v-if="attachment_files_data?.length"
            class="flex gap-2 items-start text-stone-600"
          >
            <div>
              <label class="label">
                <span class="text-lg text-stone-500 font-semibold uppercase">{{ capitalizeOnlyFirstLetter($t('attachment_files')) }}</span>
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
        </div>
      </div>
      <OrderHistoryModelingDetailsCheckoutCard
        v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
        class="w-full self-center"
        :order="order"
      />
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";
import {
  IModelingOrder,
  IModelingOrderItemAttribute,
  IModelingOrderItemType,
  IModelingOrderOrderType,
} from "~~/constants/data";
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