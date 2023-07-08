<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div class="md:px-0 px-12 flex flex-col gap-6 text-stone-700">
      <div class="text-4xl font-bold">{{ $t('_3d_modeling').toUpperCase() }}</div>
      <div class="text-lg">{{ capitalizeOnlyFirstLetter($t('describe_your_problem_and_request_a_quote_for_the_3d_modeling_service')) }}</div>
      <div></div>

      <div class="flex flex-col gap-1">
        <div class="text-xl text-stone-500 font-semibold">{{ $t('type_of_modeling').toUpperCase() }}</div>
        <SelectSingleChoice
          v-if="orderTypes.length > 0"
          :options="orderTypes"
          :preselect-option="orderTypes[0]"
          :extract-id="(item: IModelingOrderOrderType) => item.id"
          :extract-title="(item: IModelingOrderOrderType) => capitalizeOnlyFirstLetter($t(item.name))"
          :extract-icon-name="(item: IModelingOrderOrderType) => item.icon_name"
          :enable-unselected-border="true"
          @on-selection-change="l => orderTypeSelectionChange(l)"
        />
        <div class="text-stone-400 text-lg max-w-lg">
          <span class="font-bold"> {{ capitalizeOnlyFirstLetter($t('note')) }} </span>: {{ capitalizeOnlyFirstLetter($t('for_the_design_of_a_new_model_it_is_recommended_to_attach_drawings_with_measurements_along_with_a_detailed_description_of_the_desired_item')) }}
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-xl text-stone-500 font-semibold">{{ $t('item_type').toUpperCase() }}</div>
        <SelectSingleChoice
          v-if="itemTypes.length > 0"
          :options="itemTypes"
          :preselect-option="itemTypes[0]"
          :extract-id="(option: IModelingOrderItemType) => option.id"
          :extract-title="(option: IModelingOrderItemType) => capitalizeOnlyFirstLetter($t(option.name))"
          :extract-icon-name="(item: IModelingOrderItemType) => item.icon_name"
          :enable-unselected-border="true"
          @on-selection-change="l => itemTypeSelectionChange(l)"
        />
        <div class="text-stone-400 text-lg max-w-lg">
          <span class="font-bold"> {{ capitalizeOnlyFirstLetter($t('note')) }} </span>: {{ capitalizeOnlyFirstLetter($t('for_mechanical_items_it_is_preferable_to_state_mark_where_precise_tolerances_are_important_joints_with_other_pieces_and_on_which_segments_greater_forces_are_present')) }}
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-xl text-stone-500 font-semibold">{{ $t('item_attributes').toUpperCase() }}</div>
        <SelectMultiChoice
          v-if="itemAttributes.length > 0"
          :options="itemAttributes"
          :extract-id="(option: IModelingOrderItemAttribute) => option.id"
          :extract-title="(option: IModelingOrderItemAttribute) => capitalizeOnlyFirstLetter($t(option.name))"
          :extract-description="(option: IModelingOrderItemAttribute) => capitalizeOnlyFirstLetter($t(option.description || ''))"
          @on-selection-change="l => itemAttributeSelectionChange(l)"
        />
      </div>

      <FormKit
        type="form"
        id="modeling-order-form"
        @submit="submitHandler"
        :actions="false"
        :incomplete-message="false"
      >
        <div class="flex flex-col gap-2 pt-10">
          <div class="flex flex-col lg:flex-row gap-5">
            <div class="flex-1 flex flex-col">
              <div class="flex gap-5 justify-start">
                <FormKit
                  type="text"
                  v-model="modeling_order.contact_email"
                  :placeholder="capitalizeOnlyFirstLetter($t('contact_email'))"
                  validation="email|required"
                  validation-visibility="submit"
                  :validation-messages="{
                    required: 'Leave your contact email'
                  }"
                />
                <div
                  v-show="user"
                  class="link link-info font-semibold pt-3"
                  @click="onUseDefaultContactEmail"
                >{{ capitalizeOnlyFirstLetter($t('use_default')) }}</div>
              </div>
              <FormKit
                type="textarea"
                v-model="modeling_order.comment"
                rows="1"
                :placeholder="capitalizeOnlyFirstLetter($t('description'))"
                validation="required"
                validation-visibility="submit"
                :validation-messages="{
                  required: 'Please describe your problem'
                }"
                :classes="{
                  input: 'h-64',
                }"
              />
            </div>
            <div class="mb-5">
              <DragAndDropArea
                class="h-full"
                :title="capitalizeOnlyFirstLetter($t('choose_file_or_drag_it_here'))"
                :hide-privacy-label="false"
                subtitle=".TXT, .PDF, .JPG, .JPEG, .PNG"
                @on-change="change"
                @on-drop="drop"
              />
            </div>
          </div>

          <ServicesModelingAttachmentFiles />
          <ServicesModelingAttachmentImages />
          <div class="flex justify-center mt-4">
            <FormKit
              type="submit"
              :label="capitalizeOnlyFirstLetter($t('send_request'))"
            />
          </div>
        </div>
      </FormKit>
    </div>
    <div class="
              md:hidden
              toast
              mx-6
              my-6
              flex
              flex-col
              gap-3">
      <FileUploadFAB @change="change" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  MODELING_ORDER_ATTACHMENT_FILE_TYPES,
  MODELING_ORDER_ATTACHMENT_IMAGE_TYPES,
} from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IModelingOrderItemAttribute,
  IModelingOrderItemType,
  IModelingOrderOrderType,
} from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useLoadingOverlayStore } from "~~/stores/loading_overlay";
import { useModelingOrderStore } from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";

const { t } = useI18n();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const loadingOverlayStore = useLoadingOverlayStore();
const modelingOrderStore = useModelingOrderStore();
const notificationStore = useNotificationStore();

if (
  !modelingOrderStore.getItemTypes.length ||
  !modelingOrderStore.getItemAttributes.length ||
  !modelingOrderStore.getOrderTypes.length
) {
  loadingOverlayStore.show();
}

const { user } = storeToRefs(authStore);
const { modeling_order, itemTypes, itemAttributes, orderTypes } =
  storeToRefs(modelingOrderStore);

onMounted(async () => {
  await modelingOrderStore
    .fetchItemTypes()
    .then((res: IModelingOrderItemType[]) => {
      console.debug("Item types fetched");

      // * Manually assign first item type to order
      modelingOrderStore.updateOrder({ item_type: res[0] });
    })
    .catch((err) => notificationStore.showFetchError(err));

  await modelingOrderStore
    .fetchItemAttributes()
    .then(() => console.debug("Item attributes fetched"))
    .catch((err) => notificationStore.showFetchError(err));

  await modelingOrderStore
    .fetchOrderTypes()
    .then(() => console.debug("Order types fetched"))
    .catch((err) => notificationStore.showFetchError(err));
});

const isLoggedIn = computed(() => authStore.loggedIn);

function change(e: any) {
  // * Gets triggered when user selects
  // * files after CLICKING on container

  var files = Array.from<File>(e.target.files);
  onFilesAdded(files);
}

function drop(e: any) {
  // * Gets triggered when user selects
  // * files after DRAG AND DROP on container

  var files = Array.from<File>(e.dataTransfer.files);
  onFilesAdded(files);
}

function onFilesAdded(files: File[]) {
  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (listContains(MODELING_ORDER_ATTACHMENT_FILE_TYPES, element.type)) {
      modelingOrderStore.addAttachmentFile(<IAttachmentFile>{
        file: element,
        comment: "",
        localUrl: URL.createObjectURL(element),
      });
    } else if (
      listContains(MODELING_ORDER_ATTACHMENT_IMAGE_TYPES, element.type)
    ) {
      modelingOrderStore.addAttachmentImage(<IAttachmentImage>{
        image: element,
        comment: "",
        localUrl: URL.createObjectURL(element),
      });
    } else {
      notificationStore.show(
        capitalizeOnlyFirstLetter(t("file_type")) +
          " " +
          filenameExtension(element.name).toUpperCase() +
          " " +
          capitalizeOnlyFirstLetter(t("not_supported")),
        ToastLevelType.error
      );
      console.log("File type not supported yet TODO");
    }
  }
}

async function submitHandler() {
  dialogStore.open(
    "ServicesModelingCreatingOrderDialog",
    {},
    undefined,
    "2xl",
    false
  );
}

function onUseDefaultContactEmail() {
  if (user.value?.profile?.email) {
    modeling_order.value.contact_email = user.value?.profile?.email;
  }
}

function itemAttributeSelectionChange(
  itemAttributes: IModelingOrderItemAttribute[]
) {
  modelingOrderStore.updateOrder({ item_attributes: itemAttributes });
}

function itemTypeSelectionChange(itemType: IModelingOrderItemType) {
  modelingOrderStore.updateOrder({ item_type: itemType });
}

function orderTypeSelectionChange(orderType: IModelingOrderOrderType) {
  modelingOrderStore.updateOrder({ order_type: orderType });
}

watch(
  [itemTypes, itemAttributes, orderTypes],
  ([newA, newB, newC], [oldA, oldB, oldC]) => {
    // Disable loading overlay when all data is fetched

    if (newA.length && newB.length && newC.length) {
      loadingOverlayStore.close();
    } else {
      loadingOverlayStore.show();
    }
  }
);
</script>

<style>
</style>