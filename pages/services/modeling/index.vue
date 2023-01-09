<template>
  <div class="container p-12">
    <div class="flex flex-col gap-8">
      <div class="text-4xl">3d modeling</div>
      <div class="flex gap-6 justify-start">
        <div class="flex gap-3 items-center text-lg">
          <Icon
            name="iconoir:3d-select-solid"
            class="text-red-500"
            size="37"
          />
          <div class="text-gray-700">Mechanical parts</div>
        </div>
        <div class="flex gap-3 items-center text-lg">
          <Icon
            class="text-primary"
            name="cil:3d"
            size="37"
          />
          <div class="text-gray-700">Company merchandise</div>
        </div>
        <div class="flex gap-3 items-center text-lg">
          <Icon
            class="text-green-700"
            name="iconoir:3d-select-solid"
            size="37"
          />
          <div class="text-gray-700">Gifts</div>
        </div>
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
                  v-model="contactEmail"
                  placeholder="Contact e-mail"
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
                >Use default</div>
              </div>
              <FormKit
                type="textarea"
                v-model="comment"
                rows="1"
                placeholder="What can we do for you?"
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
            <div class="card shadow-sm border border-gray-300 bg-white rounded-xl mb-5">
              <div
                class="flex h-full p-4"
                @dragover.prevent
                @drop.prevent
              >
                <label
                  for="dropzone-file"
                  class="flex-1 flex flex-col gap-2 items-center justify-center px-12 bg-gray-200 w-full border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 rounded-lg py-6"
                  @drop="drop"
                >
                  <div class="text-blue-500">
                    <Icon
                      name="material-symbols:upload-file"
                      size="55"
                      aria-hidden="true"
                    />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Drag your attachments here</span></p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">TXT, PDF, JPG or PNG (MAX. 800x400px)</p>
                  <div class="btn btn-ghost bg-blue-500 text-white mt-1">Browse files</div>
                  <input
                    id="dropzone-file"
                    type="file"
                    name="fff"
                    class="hidden"
                    @change="change"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="divider p-0 m-0"></div>
          <ServicesModelingAttachments />
          <div class="flex justify-center mt-12">
            <FormKit
              type="submit"
              label="Send request"
              :classes="{
              input: 'btn-lg btn-block',
            }"
            />
          </div>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { MODELING_ORDER_ATTACHMENT_FILE_TYPES } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import {
  IModelingOrderAttachmentFileResponse,
  IModelingOrderAttachmentImageResponse,
  IModelingOrderResponse,
  useModelingOrderStore,
} from "~~/stores/modeling_order";
import { useNotificationStore } from "~~/stores/notification";
import { IPrintOrderAttachmentFileResponse } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const modelingOrderStore = useModelingOrderStore();

const { user } = storeToRefs(authStore);
const { contactEmail, comment } = storeToRefs(modelingOrderStore);

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

    if (MODELING_ORDER_ATTACHMENT_FILE_TYPES.indexOf(element.type) > -1) {
      modelingOrderStore.addAttachmentFile(<
        IModelingOrderAttachmentFileResponse
      >{
        file: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else if (element.type === "image/jpeg") {
      modelingOrderStore.addAttachmentImage(<
        IModelingOrderAttachmentImageResponse
      >{
        image: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else {
      notificationStore.show(
        "File type " +
          filenameExtension(element.name).toUpperCase() +
          " is not supported",
        ToastLevel.error()
      );
      console.log("File type not supported yet TODO");
    }
  }
}

async function submitHandler() {
  dialogStore.open("ServicesModelingCreatingOrderDialog", [], "2xl", false);
}

function onUseDefaultContactEmail() {
  if (user.value?.profile?.email) {
    contactEmail.value = user.value?.profile?.email;
  }
}
</script>

<style>
</style>