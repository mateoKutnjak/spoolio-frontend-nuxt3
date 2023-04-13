<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-10 justify-between pt-4">
      <div class="flex flex-col gap-5 sm:flex-row justify-between items-center">
        <div class="text-4xl">Create your printing order</div>
        <div class="flex gap-4 items-end">
          <ListboxDimensionUnit class="self-end" />
          <!-- <ListboxRotationUnit class="self-end" /> -->
          <div
            class="btn btn-error"
            :class="units.length ? '' : 'btn-disabled'"
            @click="onClearOrder"
          >Clear order</div>
        </div>
      </div>
      <div v-if="units.length > 0 || itemInsertedLoading">
        <div class="flex flex-col gap-8">
          <div class="p-2 flex flex-col sm:flex-row gap-2 justify-start sm:rounded-xl bg-white overflow-x-auto shadow rounded-none">
            <div class="px-3 py-2 flex items-center">
              <div class="text-base text-gray-700 font-normal mr-2"> Number of different items: </div>
              <div class="text-md font-bold">{{ units.length }}</div>
            </div>
            <div class="px-3 py-2 flex items-center">
              <div class="text-base text-gray-700 font-normal mr-2"> Total price: </div>

              <div v-if="totalPrice === Number.NEGATIVE_INFINITY">
                <Icon
                  class="text-gray-500 -my-10"
                  name="eos-icons:three-dots-loading"
                  size="50"
                />
              </div>
              <div
                v-else-if="totalPrice === Number.POSITIVE_INFINITY"
                class="px-3 py-0.5 bg-error rounded-md shadow text-sm text-white font-semibold"
              >
                Error
              </div>
              <div
                v-else-if="totalPrice <= PRINT_ORDER_MIN_PRICE"
                class="flex gap-1 items-center justify-end"
              >
                <div
                  class="btn btn-ghost btn-sm gap-2 text-lg text-gray-700"
                  @click="notificationStore.show(`Minimum price we charge is ${PRINT_ORDER_MIN_PRICE}€`)"
                >
                  <Icon
                    class="text-warning"
                    name="lucide:alert-triangle"
                    size="20"
                  />
                  €{{totalPrice.toFixed(2) }}
                </div>

              </div>
              <strong
                class="text-lg font-bold text-gray-700 "
                v-else
              >€{{totalPrice.toFixed(2) }}</strong>
            </div>
            <div class="px-3 py-2 flex gap-2 items-center">
              <div class="text-base text-gray-700 font-normal"> ETA: </div>

              <div v-if="etaSeconds === Number.NEGATIVE_INFINITY">
                <Icon
                  class="text-gray-500 -my-10"
                  name="eos-icons:three-dots-loading"
                  size="50"
                />
              </div>
              <div
                v-else-if="etaSeconds === Number.POSITIVE_INFINITY"
                class="px-3 py-0.5 bg-error rounded-md shadow text-sm text-white font-semibold"
              >
                Error
              </div>
              <strong
                class="text-md font-bold"
                v-else
              >{{reformatSeconds(etaSeconds)}}</strong>
            </div>
          </div>
          <div class="w-full hidden lg:block bg-white p-3 shadow-md rounded-lg">
            <table class="table-auto w-full">
              <thead class="rounded-lg">
                <tr class="bg-base-200">
                  <th class="pt-4 pb-3 text-start text-xs uppercase"></th>
                  <th class="pt-4 pb-3 text-start text-xs uppercase">Unit details</th>
                  <th class="pt-4 pb-3 text-center text-xs uppercase">Attributes</th>
                  <th class="pt-4 pb-3 text-center text-xs uppercase">Price</th>
                  <th class="pt-4 pb-3 text-end text-xs uppercase"></th>
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
            <ContentLoader
              v-if="itemInsertedLoading"
              class="pb-6"
              viewBox="0 0 800 150"
            ></ContentLoader>
            <div
              class="p-6 py-3"
              @dragover.prevent
              @drop.prevent
            >
              <label
                for="dropzone-file"
                class="h-44 flex gap-5 items-center justify-center w-full border-2 border-stone-300 border-dashed cursor-pointer bg-stone-200/30 hover:bg-stone-200/60 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                @drop="drop"
              >
                <div class="mb-2">
                  <Icon
                    class="text-stone-400/70"
                    name="lucide:file-box"
                    size="50"
                    aria-hidden="true"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm text-stone-500 dark:text-gray-400"><span class="font-semibold">Add 3D model</span> or drag and drop</p>
                  <p class="text-sm text-stone-500 dark:text-gray-400">.STL (max 150 MB)</p>
                </div>
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

          <div class="block lg:hidden">
            <div
              class="flex flex-col gap-5"
              v-for="item in units"
              :key="item.localUrl"
            >
              <ServicesPrintingUnitCard
                :unit="item"
                @on-item-clicked="onItemClicked"
              />
            </div>
            <div
              class="mt-8"
              @dragover.prevent
              @drop.prevent
            >
              <label
                for="dropzone-file"
                class="py-12 flex gap-5 items-center justify-center w-full border-2 border-stone-300 border-dashed cursor-pointer bg-stone-200/30 hover:bg-stone-200/60 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                @drop="drop"
              >
                <div class="mb-2">
                  <Icon
                    class="text-stone-400/70"
                    name="lucide:file-box"
                    size="50"
                    aria-hidden="true"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm text-stone-500 dark:text-gray-400"><span class="font-semibold">Add 3D model</span> or drag and drop</p>
                  <p class="text-sm text-stone-500 dark:text-gray-400">.STL (max 150 MB)</p>
                </div>
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

          <div class="hidden md:flex gap-5 justify-end">
            <NuxtLink
              class="btn btn-primary btn-lg gap-1"
              :class="units.length && totalPrice !== Number.NEGATIVE_INFINITY && totalPrice !== Number.POSITIVE_INFINITY && etaSeconds !== Number.NEGATIVE_INFINITY && etaSeconds !== Number.POSITIVE_INFINITY ? '' : 'btn-disabled'"
              to="/services/printing/checkout/"
            >
              <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
              <ClientOnly>
                <div> {{ isLoggedIn ? 'Checkout' : 'Checkout as guest'}}</div>
              </ClientOnly>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          @dragover.prevent
          @drop.prevent
        >
          <label
            for="dropzone-file"
            class="my-12 py-24 flex gap-5 items-center justify-center w-full border-2 border-stone-300 border-dashed cursor-pointer bg-stone-200/30 hover:bg-stone-200/60 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            @drop="drop"
          >
            <div class="mb-2">
              <Icon
                class="text-stone-400/70"
                name="lucide:file-box"
                size="50"
                aria-hidden="true"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-sm text-stone-500 dark:text-gray-400"><span class="font-semibold">Add 3D model</span> or drag and drop</p>
              <p class="text-sm text-stone-500 dark:text-gray-400">.STL (max 150 MB)</p>
            </div>
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
    <div class="md:hidden mx-6 my-6 flex justify-end gap-3">

      <div>
        <div
          class="tooltip tooltip-left"
          data-tip="Upload 3D model"
        >
          <label
            for="dropzone-file"
            class="btn btn-circle btn-ghost btn-lg bg-base-100 shadow-md"
            @drop="drop"
          >
            <Icon
              name="lucide:upload-cloud"
              size="27"
              aria-hidden="true"
            />
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
      <div>
        <div
          class="tooltip tooltip-left"
          data-tip="Checkout"
        >
          <NuxtLink
            class="btn btn-circle btn-primary btn-lg shadow-md"
            :class="totalPrice > 0 ? '' : 'btn-disabled'"
            to="/services/printing/checkout/"
          >
            <Icon
              name="lucide:shopping-cart"
              size="27"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  MAX_FILE_SIZE_STL,
  PRINT_ORDER_MIN_PRICE,
} from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IPrintOrderUnit,
} from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { useGlobalsStore } from "~~/stores/globals";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";
import { ContentLoader } from "vue-content-loader";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const filamentSpoolStore = useFilamentSpoolStore();
const filamentInfillStore = useFilamentInfillStore();
const globalsStore = useGlobalsStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { dimensionUnit, rotationUnit } = storeToRefs(globalsStore);

const isLoggedIn = computed(() => authStore.loggedIn);

const attachmentFiles = ref<IAttachmentFile[]>([]);
const attachmentImages = ref<IAttachmentImage[]>([]);
const units = ref<IPrintOrderUnit[]>([]);

const unit = ref<IPrintOrderUnit>();

const files = ref<any>([]);
const formkitFiles = ref<any>([]);

const isDetailsDialogShown = ref(false);
const itemInsertedLoading = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

const totalPrice = computed(() => {
  return printOrderStore.getTotalPrice;
});

const etaSeconds = computed(() => {
  return printOrderStore.getETASeconds;
});

onMounted(async () => {
  await filamentSpoolStore
    .fetchFilamentSpools()
    .then(() => {})
    .catch((err) => notificationStore.showFetchError(err));

  console.log("Spools fetched successfuly TODO");

  await filamentInfillStore
    .fetchFilamentInfills()
    .then(() => {
      console.log("Infills fetched successfuly TODO");
    })
    .catch((err) => notificationStore.showFetchError(err));

  console.log("Infills fetched successfuly TODO");

  for (
    let index = 0;
    index < printOrderStore.getAttachmentFiles.length;
    index++
  ) {
    const element: IAttachmentFile = printOrderStore.getAttachmentFiles[index];
    attachmentFiles.value.push(element);
  }

  for (
    let index = 0;
    index < printOrderStore.getAttachmentImages.length;
    index++
  ) {
    const element: IAttachmentImage =
      printOrderStore.getAttachmentImages[index];
    attachmentImages.value.push(element);
  }

  for (let index = 0; index < printOrderStore.units.length; index++) {
    const element: IPrintOrderUnit = printOrderStore.getUnits[index];
    units.value.push(element);
  }
});

watch(getUser, (value, oldValue, onInvalidate) => {});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  console.log("Current units " + value.map((el) => el.localUrl));

  units.value = value;
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
      length_unit: DimensionUnit[value],
    });
  });
});

watch(rotationUnit, (value) => {
  printOrderStore.units.forEach((el) => {
    printOrderStore.updateUnit(el.localUrl, {
      rotation_unit: RotationUnit[value],
    });
  });
});

function change(e: any) {
  // * Gets triggered when user selects
  // * files after CLICKING on container

  itemInsertedLoading.value = true;

  var files = Array.from<File>(e.target.files);

  if (!files.length) {
    itemInsertedLoading.value = false;
    return;
  }

  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.size > MAX_FILE_SIZE_STL) {
      notificationStore.show(
        element.name +
          " exceeds the limit of " +
          MAX_FILE_SIZE_STL / 1024 / 1024 +
          " MBs",
        ToastLevelType.info
      );
      return;
    }
  }
  onFilesAdded(files);
}

function drop(e: any) {
  // * Gets triggered when user selects
  // * files after DRAG AND DROP on container

  itemInsertedLoading.value = true;

  var files = Array.from<File>(e.dataTransfer.files);

  if (!files.length) {
    itemInsertedLoading.value = false;
    return;
  }

  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.size > MAX_FILE_SIZE_STL) {
      notificationStore.show(
        element.name +
          " exceeds the limit of " +
          MAX_FILE_SIZE_STL / 1024 / 1024 +
          " MBs"
      );
      return;
    }
  }
  onFilesAdded(files);
}

function onFilesAdded(files: File[]) {
  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.type === "application/pdf") {
      printOrderStore.addAttachmentFile(<IAttachmentFile>{
        file: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else if (element.type === "image/jpeg") {
      printOrderStore.addAttachmentImage(<IAttachmentImage>{
        image: element,
        comment: "TODO",
        localUrl: URL.createObjectURL(element),
      });
    } else {
      printOrderStore.add3dModelFile(
        element,
        () => (itemInsertedLoading.value = false)
      );
    }
  }
}

function onItemClicked(localUrl: string) {
  unit.value = units.value.find((el) => el.localUrl === localUrl);
  isDetailsDialogShown.value = true;

  dialogStore.open(
    "ServicesPrintingUnitPreviewDialog",
    { unit: unit.value },
    "2xl"
  );
}

function onClearOrder() {
  dialogStore.open("DialogConfirmClearPrintOrder", {});
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(150%);
  transition: all 0.5s ease-in-out;
}
</style>