<template>
  <div class="container p-12">
    <div class="flex flex-col flex-grow gap-5 justify-between">
      <DimensionUnitDropdown class="self-end" />
      <div class="block lg:hidden">
        <ServicesPrintingUnitCard
          v-for="item in units"
          :key="item.localUrl"
          :unit="item"
          @on-item-clicked="onItemClicked"
        />
      </div>
      <table
        v-if="units.length"
        class="hidden lg:table w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-md"
      >
        <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr class="border-2">
            <th
              scope="col"
              class="py-4"
            >
              <span class="sr-only">Image</span>
            </th>
            <th
              scope="col"
              class="py-4"
            >
              Product
            </th>
            <th
              scope="col"
              class="py-4"
            >
              Attributes
            </th>
            <th
              scope="col"
              class="py-4 px-8"
            >
              Quantity
            </th>
            <th
              scope="col"
              class="py-4"
            >
              Price
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          <ServicesPrintingUnitTableRow
            v-for="item in units"
            :key="item.localUrl"
            :unit="item"
            @on-item-clicked="onItemClicked"
          />
        </tbody>
      </table>
      <div
        v-else
        class="flex-1 text-center"
      >
        <div class="h-44 w-full flex justify-center items-center text-lg italic text-gray-600">Nothing added yet</div>
      </div>
      <div class="flex gap-5">
        <div
          class="flex-1 flex w-full mx-auto"
          @dragover.prevent
          @drop.prevent
        >
          <label
            for="dropzone-file"
            class="flex-1 flex flex-col items-center justify-center w-full border-4 border-gray-300 border-dashed cursor-pointer bg-transparent dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
            <p class="text-xs text-gray-500 dark:text-gray-400">STL (MAX. 800x400px) [TODO change]</p>
            <input
              id="dropzone-file"
              type="file"
              name="fff"
              class="hidden"
              @change="change"
            />
          </label>
        </div>
        <div class="flex-none card rounded-lg shadow-md bg-white">
          <div class="card-body flex gap-5">
            <table class="table table-compact w-full">
              <tbody class="">
                <tr>
                  <td class="pl-0 py-1 text-md border-transparent text-start">Estimated completion time</td>
                  <td class="pl-0 py-1 text-md border-transparent text-end">111 days</td>
                </tr>
                <tr>
                  <th class="pl-0 py-1 text-lg text-start">Total price</th>
                  <th class="pl-0 py-1 text-lg text-end"> ${{totalPrice}}</th>
                </tr>
              </tbody>
            </table>
            <NuxtLink
              class="btn btn-primary btn-lg gap-1"
              :class="totalPrice > 0 ? '' : 'btn-disabled'"
              to="/services/printing/checkout/"
            >
              Checkout
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useFilamentColorStore } from "~~/stores/filament_color";
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { useFilamentMaterialStore } from "~~/stores/filament_material";
import { useGlobalsStore } from "~~/stores/globals";
import {
  usePrintOrderStore,
  IPrintOrderAttachmentFileResponse,
  IPrintOrderAttachmentImageResponse,
  IPrintOrderUnitResponse,
  IPrintOrderResponse,
} from "~~/stores/print_order";
import { useShippingMethodStore } from "~~/stores/shipping_method";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const filamentColorStore = useFilamentColorStore();
const filamentMaterialStore = useFilamentMaterialStore();
const filamentInfillStore = useFilamentInfillStore();
const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();
const shippingMethodStore = useShippingMethodStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);
const units = ref<IPrintOrderUnitResponse[]>([]);

const unit = ref<IPrintOrderUnitResponse>();

const totalPrice = ref<number>(0);

const files = ref<any>([]);
const formkitFiles = ref<any>([]);

const submitted = ref(false);
const isDetailsDialogShown = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

onMounted(async () => {
  await filamentColorStore
    .fetchFilamentColors()
    .then(() => {
      console.log("Colors fetched successfuly TODO");
    })
    .catch((err) => console.log("Colors fetch error TODO"));

  console.log("Colors fetched successfuly TODO");

  await filamentMaterialStore
    .fetchFilamentMaterials()
    .then(() => {
      console.log("Materials fetched successfuly TODO");
    })
    .catch((err) => console.log("Materials fetch error TODO"));

  console.log("Materials fetched successfuly TODO");

  await filamentInfillStore
    .fetchFilamentInfills()
    .then(() => {
      console.log("Infills fetched successfuly TODO");
    })
    .catch((err) => console.log("Infills fetch error TODO"));

  console.log("Infills fetched successfuly TODO");

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

  totalPrice.value = units.value.reduce(
    (acc, item) => Number(acc) + Number(item.estimatedPrice * item.quantity),
    0
  );
});

watch(getUser, (value, oldValue, onInvalidate) => {});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  console.log("Current units " + value.map((el) => el.localUrl));

  units.value = value;
  totalPrice.value = units.value.reduce(
    (acc, item) => Number(acc) + Number(item.estimatedPrice * item.quantity),
    0
  );
});

watch(printOrderStore.getAttachmentFiles, (value, oldValue, onInvalidate) => {
  attachmentFiles.value = value;
});

watch(printOrderStore.getAttachmentImages, (value, oldValue, onInvalidate) => {
  attachmentImages.value = value;
});

watch(formkitFiles, (value, oldValue, onInvalidate) => {
  files.value.push(value);
});

watch(dimensionUnit, (value) => {
  printOrderStore.units.forEach((el) => {
    printOrderStore.updateUnit(el.localUrl, {
      lengthUnit: DimensionUnit[value],
    });
  });
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
        id: undefined,
        quantity: 1,
        color: filamentColorStore.getFilamentColors[0].id,
        material: filamentMaterialStore.getFilamentMaterials[0].id,
        infill: filamentInfillStore.getFilamentInfills[0].id,
        estimatedPrice: 20,
        file: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
        attachmentFiles: [],
        attachmentImages: [],
        order: undefined,
        modelDimensions: undefined,
        lengthUnit: DimensionUnit[dimensionUnit.value],
      });

      console.log(
        "Current units " + printOrderStore.getUnits.map((el) => el.localUrl)
      );
    }
  }
}

function onItemClicked(localUrl: string) {
  unit.value = units.value.find((el) => el.localUrl === localUrl);
  isDetailsDialogShown.value = true;

  dialogStore.open("ServicesPrintingDialog", [unit.value], "2xl");
}

function removeUnit(unit: IPrintOrderUnitResponse) {
  printOrderStore.removeUnit(unit);
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
  // await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
};
</script>

<style>
</style>