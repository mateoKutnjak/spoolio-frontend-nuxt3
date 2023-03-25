<template>
  <div class="container mx-auto">
    <div class="max-w-5xl mx-auto flex flex-col gap-5 justify-between pt-4">
      <div class="flex flex-col gap-5 sm:flex-row justify-between items-center">
        <div class="text-4xl">Create your printing order</div>
        <div class="flex gap-4 items-end">
          <ListboxDimensionUnit class="self-end" />
          <div
            class="btn btn-error"
            :class="units.length ? '' : 'btn-disabled'"
            @click="onClearOrder"
          >Clear order</div>
        </div>
      </div>
      <div class="mx-4 mt-8 sm:mx-0 flex flex-col sm:flex-row gap-2 items-center px-4  py-3 rounded-lg bg-base-100 shadow border-2 border-gray-400">
        <div class="flex items-center">
          <div class="text-base text-gray-700 font-normal mr-2"> Total price: </div>
          <div
            v-if="totalPrice == 10"
            class="flex gap-1 items-center justify-end"
          >
            <div
              class="btn btn-ghost btn-sm gap-2 text-lg text-gray-700"
              @click="notificationStore.show('Minimum price we charge is 10€')"
            >
              <Icon
                class="text-warning"
                name="material-symbols:warning-rounded"
                size="20"
              />
              €{{totalPrice.toFixed(2) }}
            </div>

          </div>
          <div v-else-if="totalPrice >= 0">
            <div class="text-lg font-medium text-gray-700 ">
              €{{ (totalPrice).toFixed(2) }}
            </div>
          </div>
          <div v-else>
            <Icon
              class="text-gray-500"
              name="eos-icons:three-dots-loading"
            />
          </div>
        </div>
        <div class="px-1"></div>
        <div class="flex gap-2 items-center">
          <div class="text-base text-gray-700 font-normal"> ETA: </div>

          <strong
            class="text-md font-medium"
            v-if="etaSeconds > Number.NEGATIVE_INFINITY"
          >{{reformatSeconds(etaSeconds)}}</strong>
          <div v-else>
            <Icon
              class="text-gray-900 pt-1.5"
              name="eos-icons:three-dots-loading"
              size="30"
            />
          </div>
        </div>
      </div>
      <div class="divider my-0"></div>
      <div class="block lg:hidden">
        <div
          class="flex flex-col gap-5"
          v-for="item in units"
          :key="item.localUrl"
        >
          <ServicesPrintingUnitCard
            class="mb-3"
            :unit="item"
            @on-item-clicked="onItemClicked"
          />
        </div>

      </div>
      <table
        v-if="units.length"
        class="hidden lg:inline-table table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >

        <tbody
          name="slide-fade"
          is="vue:transition-group"
          tag="tbody"
        >

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
        <div class="h-44 w-full flex justify-center items-center text-3xl font-normal italic text-gray-400">Order is empty</div>
      </div>
      <div class="hidden md:flex gap-5">
        <div
          class="flex-1 flex w-full mx-auto "
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
            <p class="text-xs text-gray-500 dark:text-gray-400">STL (max 150 MB)</p>
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
                  <td class="pl-0 py-1 text-base border-transparent text-start font-normal">ETA</td>
                  <td class="pl-0 py-1 text-lg border-transparent text-end font-medium">
                    <div>
                      <strong
                        class="text-lg font-medium"
                        v-if="etaSeconds > Number.NEGATIVE_INFINITY"
                      >{{reformatSeconds(etaSeconds)}}</strong>
                      <div v-else>
                        <Icon
                          class="text-gray-900 pt-1.5"
                          name="eos-icons:three-dots-loading"
                          size="30"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="pl-0 py-1 text-base text-start font-normal">Price</th>
                  <th class="pl-0 py-1 text-lg text-end font-medium">
                    <div
                      v-if="totalPrice == 10"
                      class="flex gap-1 items-center justify-end"
                    >

                      <div
                        class="btn btn-ghost btn-sm gap-2 text-lg text-gray-700"
                        @click="notificationStore.show('Minimum price we charge is 10€')"
                      >
                        <Icon
                          class="text-warning"
                          name="material-symbols:warning-rounded"
                          size="20"
                        />
                        €{{totalPrice.toFixed(2) }}
                      </div>

                    </div>
                    <div v-else-if="totalPrice >= 0">€{{ (totalPrice).toFixed(2) }}</div>
                    <div v-else>
                      <Icon
                        class="text-gray-500"
                        name="eos-icons:three-dots-loading"
                      />
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
            <NuxtLink
              class="btn btn-primary btn-lg gap-1"
              :class="units.length ? '' : 'btn-disabled'"
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
              name="ic:outline-cloud-upload"
              size="30"
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
              name="ph:shopping-cart-duotone"
              size="30"
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
import { MAX_FILE_SIZE_STL } from "~~/constants/constants";
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

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const filamentSpoolStore = useFilamentSpoolStore();
const filamentInfillStore = useFilamentInfillStore();
const globalsStore = useGlobalsStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const isLoggedIn = computed(() => authStore.loggedIn);

const attachmentFiles = ref<IAttachmentFile[]>([]);
const attachmentImages = ref<IAttachmentImage[]>([]);
const units = ref<IPrintOrderUnit[]>([]);

const unit = ref<IPrintOrderUnit>();

const files = ref<any>([]);
const formkitFiles = ref<any>([]);

const isDetailsDialogShown = ref(false);

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

function change(e: any) {
  // * Gets triggered when user selects
  // * files after CLICKING on container

  var files = Array.from<File>(e.target.files);
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

  var files = Array.from<File>(e.dataTransfer.files);
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
      printOrderStore.add3dModelFile(element);
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