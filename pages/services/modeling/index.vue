<template>
  <div class="container mx-auto mb-32 pt-12">
    <div class="md:px-0 px-12 flex flex-col gap-4 text-stone-700">
      <div class="flex mb-10">
        <div class="text-lg text-gray-500">HOME</div>
        <div class="text-lg text-gray-500 mx-3">/</div>
        <div class="text-lg text-gray-500">3D MODELIRANJE</div>
      </div>
      <div class="mb-4">
        <div class="text-basis-content font-bold text-5xl pb-4">{{ $t('_3d_modeling').toUpperCase() }}</div>
        <div class="text-lg">{{ capitalizeOnlyFirstLetter($t('describe_your_problem_and_request_a_quote_for_the_3d_modeling_service')) }}</div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-2xl text-basis-content">{{ $t('type_of_modeling').toUpperCase() }}</div>
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
        <div class="text-gray-400 text-md w-fill">
          <span class="font-bold"> {{ capitalizeOnlyFirstLetter($t('note')) }} </span>: {{ capitalizeOnlyFirstLetter($t(modeling_order?.order_type?.description || '')) }}
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-2xl text-base-content">{{ $t('item_type').toUpperCase() }}</div>
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
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-2xl text-base-content">{{ $t('item_attributes').toUpperCase() }}</div>
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
        <div class="flex flex-col gap-2 pt-8">
          <div class="text-xl">{{ $t('contact_email').toUpperCase() }}</div>
          <div class="flex flex-col lg:flex-row gap-5">            
            <div class="grow 2xl:grow-0 2xl:w-1/2 flex flex-col">                
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
              <div>
                <div class="text-xl">{{ $t('description').toUpperCase() }}</div>
                <FormKit
                  type="textarea"
                  v-model="modeling_order.comment"
                  rows="1"
                  :placeholder="capitalizeOnlyFirstLetter($t('description'))"
                  validation-visibility="submit"
                  :classes="{
                    input: 'h-52 min-h-[150px] max-h-[240px]',
                  }"
                />
              </div>
            </div>
            <div class="mb-5 lg:w-1/3 xl:w-1/2 2xl:w-1/3 w-full">
              <DragAndDropArea2
                class="h-full"
                :title="capitalizeOnlyFirstLetter($t('choose_file_or_drag_it_here'))"
                :hide-privacy-label="false"
                subtitle=".TXT, .PDF, .JPG, .JPEG, .PNG, .STL"
                @on-change="change"
                @on-drop="drop"
              />
            </div>
          </div>

          <ServicesModelingAttachments />
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
  if (user.value?.profile?.email) {
    modeling_order.value.contact_email = user.value?.profile?.email;
  } else if (user.value?.email) {
    modeling_order.value.contact_email = user.value?.email;
  }

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
    "lg",
    false
  );
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