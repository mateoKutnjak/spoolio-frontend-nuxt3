<template>
  <div class="container p-12">
    <!-- because of bottom drag and drop -->
    <div class="pb-64">
      <div class="relative flex flex-col justify-center py-8">
        <!-- <div class="columns-1 lg:columns-2 xl:columns-3 gap-5 [column-fill:_balance] box-border before:box-inherit after:box-inherit">
          <div
            v-for="(uploadedFile, index) in uploadedFiles"
            :key="uploadedFile.name"
            class="break-inside-avoid p-0 mb-5 bg-gray-100 rounded-lg"
          >
            <FileUploadListTile
              class="flex-1"
              :uploadedFile="uploadedFile"
              :uploadedFileUrl="uploadedFileUrls[index]"
              @on-remove-file="removeFile(uploadedFile)"
              @on-duplicate-file="duplicateFile(uploadedFile)"
              @on-preview-file="previewFile(uploadedFile)"
            />
          </div>
        </div> -->

        <div class="text-2xl pb-6">
          Parts [todo]
        </div>

        <div
          v-for="(unit, index) in units"
          :key="index"
          class="break-inside-avoid p-0 mb-5 bg-gray-100 rounded-lg"
        >
          <FileUploadModel
            :data="unit"
            @on-remove-file="removeImage(unit.file)"
            @on-duplicate-file="duplicateUnit(unit)"
            @on-preview-file="previewFile(unit.file)"
          />
        </div>

        <div class="divider h-0"></div>

        <div class="text-2xl py-6">
          Images
        </div>

        <div
          v-for="(attachmentImage, index) in attachmentImages"
          :key="index"
          class="break-inside-avoid p-0 mb-5 bg-gray-100 rounded-lg"
        >
          <FileUploadImage
            :imageFile="attachmentImage.image"
            :imageFileUrl="attachmentImage.localUrl"
            @on-remove-file="removeImage(attachmentImage.image)"
            @on-preview-file="previewFile(attachmentImage.image)"
          />
        </div>

        <div class="divider h-0"></div>

        <div class="text-2xl py-6">
          Attachments
        </div>

        <div
          v-for="(attachmentFile, index) in attachmentFiles"
          :key="index"
          class="break-inside-avoid p-0 mb-5 bg-gray-100 rounded-lg"
        >
          <FileUploadPDF
            class="flex-1"
            :pdf-filename="attachmentFile.file.name"
            :uploadedFileUrl="attachmentFile.localUrl"
            @on-remove-file="removeFile(attachmentFile.file)"
            @on-preview-file="previewFile(attachmentFile.file)"
          />
        </div>

      </div>
    </div>
  </div>

  <!-- <FormKit
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
            name="fff"
            class="hidden"
            @change="change"
          />
        </label>
      </div>

      <FormKit
        type="file"
        help=""
        multiple
        v-model="uploadedFiles"
        validation="required"
        :validation-messages="{
          required: 'Files are required',
        }"
      />

      <FormKit
        type="submit"
        label="Next"
      />
    </FormKit> -->

  <div class="fixed bottom-64 left-0 right-0 btn btn-primary btn-block btn-lg rounded-none">
    Order
  </div>

  <div
    class="fixed bottom-0 left-0 right-0 flex w-full h-64 mx-auto"
    @dragover.prevent
    @drop.prevent
  >
    <label
      for="dropzone-file"
      class="flex-1 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
        name="fff"
        class="hidden"
        @change="change"
      />
    </label>
  </div>

</template>
  
  <script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";
import { useFilamentColorStore } from "~~/stores/filament_color";
import { useFilamentMaterialStore } from "~~/stores/filament_material";
import {
  usePrintOrderStore,
  IPrintOrderAttachmentFileResponse,
  IPrintOrderAttachmentImageResponse,
  IPrintOrderUnitResponse,
} from "~~/stores/print_order";

const authStore = useAuthStore();
const filamentColorStore = useFilamentColorStore();
const filamentMaterialStore = useFilamentMaterialStore();
const printOrderStore = usePrintOrderStore();

const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);
const units = ref<IPrintOrderUnitResponse[]>([]);

const files = ref<any>([]);
const formkitFiles = ref<any>([]);

const submitted = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

onMounted(() => {
  filamentColorStore
    .fetchFilamentColors()
    .then(() => {
      console.log("Colors fetched successfuly TODO");
    })
    .catch((err) => console.log("Colors fetch error TODO"));

  filamentMaterialStore
    .fetchFilamentMaterials()
    .then(() => {
      console.log("Materials fetched successfuly TODO");
    })
    .catch((err) => console.log("Materials fetch error TODO"));

  for (
    let index = 0;
    index < printOrderStore.getAttachmentFiles.length;
    index++
  ) {
    const element: IPrintOrderAttachmentFileResponse =
      printOrderStore.getAttachmentFiles[index];
    attachmentFiles.value.push(element);
  }

  for (
    let index = 0;
    index < printOrderStore.getAttachmentImages.length;
    index++
  ) {
    const element: IPrintOrderAttachmentImageResponse =
      printOrderStore.getAttachmentImages[index];
    attachmentImages.value.push(element);
  }

  for (let index = 0; index < printOrderStore.units.length; index++) {
    const element: IPrintOrderUnitResponse = printOrderStore.getUnits[index];
    units.value.push(element);
  }
});

watch(getUser, (value, oldValue, onInvalidate) => {});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  units.value = value;
});

watch(printOrderStore.getAttachmentFiles, (value, oldValue, onInvalidate) => {
  attachmentFiles.value = value;
});

watch(printOrderStore.getAttachmentImages, (value, oldValue, onInvalidate) => {
  attachmentImages.value = value;
});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  units.value = value;
});

watch(formkitFiles, (value, oldValue, onInvalidate) => {
  files.value.push(value);
});

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

    if (element.type === "application/pdf") {
      printOrderStore.addAttachmentFile(<IPrintOrderAttachmentFileResponse>{
        file: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else if (element.type === "image/jpeg") {
      printOrderStore.addAttachmentImage(<IPrintOrderAttachmentImageResponse>{
        image: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else {
      printOrderStore.addUnit(<IPrintOrderUnitResponse>{
        quantity: 1,
        color: "TODO",
        material: "TODO",
        infill: 1,
        estimatedPrice: 20,
        file: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
        attachmentFiles: [],
        attachmentImages: [],
      });
    }
  }
}

function duplicateUnit(unit: IPrintOrderUnitResponse) {
  // TODO copy all unit values here
  printOrderStore.addUnit(<IPrintOrderUnitResponse>{
    quantity: unit.quantity,
    color: unit.color,
    material: unit.material,
    infill: unit.infill,
    estimatedPrice: unit.estimatedPrice,
    file: unit.file,
    comment: unit.comment,
    localUrl: URL.createObjectURL(unit.file),
    attachmentFiles: [],
    attachmentImages: [],
  });
}

function removeFile(file: File) {
  printOrderStore.removeAttachmentFile(<IPrintOrderAttachmentFileResponse>{
    file: file,
    comment: "TODO",
  });
}

function removeImage(file: File) {
  printOrderStore.removeAttachmentImage(<IPrintOrderAttachmentImageResponse>{
    image: file,
    comment: "TODO",
  });
}

function previewFile(file: File) {
  console.log("TODO");
}

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
};
</script>
  
  <style>
</style>