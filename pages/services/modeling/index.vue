<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-8">
      <div class="text-4xl">{{ capitalizeOnlyFirstLetter($t('describe_what_you_want_us_to_create_for_you')) }}</div>
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
                  :classes="{
                    input: 'rounded-xl px-2',
                    wrapper: 'shadow-xs rounded-xl',
                    inner: 'rounded-xl',
                    outer: 'rounded-xl mb-3',
                    message: 'px-5 pt-1 mb-0'
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
                  input: 'h-64 rounded-xl p-3 resize-none',
                  wrapper: 'shadow-sm rounded-xl',
                  inner: 'rounded-xl',
                  outer: 'rounded-xl mb-0',
                  message: 'px-5 pt-1'
                }"
              />
            </div>
            <div class="card p-4 mb-5 bg-white shadow">
              <DragAndDropArea
                class="h-full"
                :title="capitalizeOnlyFirstLetter($t('choose_file_or_drag_it_here'))"
                subtitle=".TXT, .PDF, .JPG, .JPEG, .PNG"
                @on-change="change"
                @on-drop="drop"
              />
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <div class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('item_type')) }}:</div>
            <SelectSingleChoice
              v-if="itemTypes.length > 0"
              :options="itemTypes"
              :preselect-option="itemTypes[0]"
              :extract-id="(option: IModelingOrderItemType) => option.id"
              :extract-title="(option: IModelingOrderItemType) => option.name"
              @on-selection-change="l => itemTypeSelectionChange(l)"
            />
          </div>
          <div class="flex gap-4 items-center">
            <div class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('item_attributes')) }}:</div>
            <SelectMultiChoice
              v-if="itemAttributes.length > 0"
              :options="itemAttributes"
              :extract-id="(option: IModelingOrderItemAttribute) => option.id"
              :extract-title="(option: IModelingOrderItemAttribute) => option.name"
              @on-selection-change="l => itemAttributeSelectionChange(l)"
            />
          </div>
          <div class="divider p-0 m-0"></div>
          <ServicesModelingAttachmentFiles />
          <ServicesModelingAttachmentImages />
          <div class="flex justify-center mt-12">
            <FormKit
              type="submit"
              :label="capitalizeOnlyFirstLetter($t('send_request'))"
              :classes="{
              input: 'btn-lg btn-block',
            }"
            />
          </div>
        </div>
      </FormKit>
    </div>
    <div class="md:hidden toast mx-6 my-6 flex flex-col gap-3">
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
  !modelingOrderStore.getItemAttributes.length
) {
  loadingOverlayStore.show();
}

const { user } = storeToRefs(authStore);
const { modeling_order, itemTypes, itemAttributes } =
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
  dialogStore.open("ServicesModelingCreatingOrderDialog", {}, "2xl", false);
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

watch([itemTypes, itemAttributes], ([newA, newB], [oldA, oldB]) => {
  // Disable loading overlay when all data is fetched

  if (newA.length && newB.length) {
    loadingOverlayStore.close();
  } else {
    loadingOverlayStore.show();
  }
});
</script>

<style>
</style>