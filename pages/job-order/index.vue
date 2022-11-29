<template>
  <div class="container p-12">
    <FormKit
      type="form"
      id="job-order-dummy-form"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Sign In"
      @submit="submitHandler"
      :actions="false"
    >

      <div
        class="flex w-full h-64"
        @dragover.prevent
        @drop.prevent
      >
        <label
          for="dropzone-file"
          class="flex-1 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          @drop="drop"
        >
          <div class="mb-2">
            <Icon
              color="gray"
              name="ic:outline-cloud-upload"
              size="30"
              aria-hidden="true"
            />
          </div>
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px) [TODO change]</p>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            @change="change"
          />
        </label>
      </div>

      <FormKit
        type="file"
        help="This input starts with files already “attached”."
        multiple
        v-model="uploadedFiles"
        validation="required"
        :validation-messages="{
        required: 'Files are required',
      }"
      />

      <ul class="m-4 space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
        <li
          class="flex items-center gap-4"
          v-for="uploadedFile in uploadedFiles"
          :key="uploadedFile.name"
        >
          <FileUploadListTile
            :file="uploadedFile"
            @on-remove-file="removeFile(uploadedFile)"
          />
        </li>
      </ul>

      <FormKit
        type="submit"
        label="Next"
      />
    </FormKit>
  </div>
</template>
  
  <script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const uploadedFiles = ref<File[]>([]);

const files = ref<any>([]);
const formkitFiles = ref<any>([]);

const submitted = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

watch(getUser, (value, oldValue, onInvalidate) => {});

watch(formkitFiles, (value, oldValue, onInvalidate) => {
  files.value.push(value);
});

function change(e: any) {
  // * Gets triggered when user selects
  // * files after CLICKING on container

  uploadedFiles.value.push(...e.target.files);
}

function drop(e: any) {
  // * Gets triggered when user selects
  // * files after DRAG AND DROP on container

  uploadedFiles.value.push(...e.dataTransfer.files);
}

function iconForFilename(filename: string) {
  console.log("JHERE");

  switch (filenameExtension(filename)) {
    case "svg":
      return "carbon:svg";
    case "pdf":
      return "vscode-icons:file-type-pdf2";
    case "jpg":
    case "png":
    case "jpeg":
      return "material-symbols:image";
    default:
      return "vscode-icons:default-file";
  }
}

function removeFile(file: File) {
  const index = uploadedFiles.value.indexOf(file, 0);
  if (index > -1) {
    uploadedFiles.value.splice(index, 1);
  }
}

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
};
</script>
  
  <style>
</style>