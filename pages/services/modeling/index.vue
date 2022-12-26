<template>
  <div class="container p-12">
    <FormKit
      type="form"
      id="modeling-order-form"
      submit-label="Sign In"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col lg:flex-row gap-5">
          <div class="flex-1 flex flex-col">
            <FormKit
              type="text"
              placeholder="What can we do for you?"
              validation="email|required"
              validation-visibility="live"
              :validation-messages="{
                required: 'Leave your contact email'
              }"
              :classes="{
                input: 'rounded-xl px-2',
                wrapper: 'shadow-sm rounded-xl',
                inner: 'rounded-xl',
                outer: 'rounded-xl'
              }"
            />
            <FormKit
              type="textarea"
              rows="1"
              placeholder="What can we do for you?"
              validation="required"
              :validation-messages="{
                required: 'Please describe your problem'
              }"
              :classes="{
                input: 'h-64 rounded-xl p-3',
                wrapper: 'shadow-sm rounded-xl',
                inner: 'rounded-xl',
                outer: 'rounded-xl mb-0'
              }"
            />
          </div>
          <div class="card shadow-sm border border-gray-300 bg-white rounded-xl">
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
        <div class="divider m-0"></div>
        <ServicesModelingAttachments />
        <div class="flex justify-center">
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
</template>

<script lang="ts" setup>
import { MODELING_ORDER_ATTACHMENT_FILE_TYPES } from "~~/constants/constants";
import {
  IModelingOrderAttachmentFileResponse,
  IModelingOrderAttachmentImageResponse,
  useModelingOrderStore,
} from "~~/stores/modeling_order";
import { IPrintOrderAttachmentFileResponse } from "~~/stores/print_order";

const modelingOrderStore = useModelingOrderStore();

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
      console.log("File type not supported yet TODO");
    }
  }
}

function submitHandler() {
  console.log("TODO submit");
}
</script>

<style>
</style>