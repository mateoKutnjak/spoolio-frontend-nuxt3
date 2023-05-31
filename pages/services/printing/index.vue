<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-10 justify-between pt-4">
      <div class="flex flex-col gap-5 sm:flex-row justify-between items-center">
        <div class="text-4xl">{{ capitalizeOnlyFirstLetter($t('create_your_3d_printing_order')) }}</div>
        <div class="flex gap-4 items-end">
          <!-- <ListboxDimensionUnit class="self-end" /> -->
          <!-- <ListboxRotationUnit class="self-end" /> -->
          <div
            class="btn btn-error"
            :class="units.length ? '' : 'btn-disabled'"
            @click="onClearOrder"
          >{{ capitalizeOnlyFirstLetter($t('clear_order')) }}</div>
        </div>
      </div>
      <div v-if="units.length > 0 || itemInsertedLoading">
        <div class="flex flex-col gap-8">
          <ServicesPrintingOrderSummary
            :eta="eta"
            :number-of-different-items="units.length"
            :number-of-items="9999"
            :total-price="totalPrice"
          />
          <div class="w-full hidden lg:block bg-white p-3 shadow-md rounded-lg">
            <table class="table-auto w-full">
              <thead class="rounded-lg">
                <tr class="bg-stone-300/60">
                  <th class="pt-4 pb-3 text-start text-xs uppercase"></th>
                  <th class="pt-4 pb-3 text-start text-xs uppercase">{{ capitalizeOnlyFirstLetter($t('unit_details')) }}</th>
                  <th class="pt-4 pb-3 text-center text-xs uppercase">{{ capitalizeOnlyFirstLetter($t('attributes')) }}</th>
                  <th class="pt-4 pb-3 text-center text-xs uppercase">{{ capitalizeOnlyFirstLetter($t('price')) }}</th>
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
            <DragAndDropArea
              class="h-56"
              :title="capitalizeOnlyFirstLetter($t('add_3d_model_or_drag_and_drop'))"
              subtitle=".STL (max 150 MB)"
              @on-change="change"
              @on-drop="drop"
            />
          </div>

          <div class="block lg:hidden">
            <div class="flex flex-col gap-2">
              <ServicesPrintingUnitCard
                v-for="item in units"
                :key="item.localUrl"
                :unit="item"
                @on-item-clicked="onItemClicked"
              />
            </div>
            <DragAndDropArea
              class="mt-4"
              :title="capitalizeOnlyFirstLetter($t('add_3d_model_or_drag_and_drop'))"
              subtitle=".STL (max 150MB)"
              @on-change="change"
              @on-drop="drop"
            />
          </div>

          <div class="hidden md:flex gap-5 justify-end">
            <NuxtLink
              class="btn btn-primary btn-lg gap-1"
              :class="units.length && totalPrice !== Number.NEGATIVE_INFINITY && totalPrice !== Number.POSITIVE_INFINITY && eta !== undefined && eta !== null ? '' : 'btn-disabled'"
              to="/services/printing/checkout/"
            >
              {{ capitalizeOnlyFirstLetter($t('checkout')) }}
              <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
              <!-- <ClientOnly>
                <div> {{ isLoggedIn ? 'Checkout' : 'Checkout as guest'}}</div>
              </ClientOnly> -->
            </NuxtLink>
          </div>
        </div>
      </div>
      <div
        v-else
        class="card p-8 shadow bg-white"
      >
        <DragAndDropArea
          class="h-[35vh]"
          :title="capitalizeOnlyFirstLetter($t('add_3d_model_or_drag_and_drop'))"
          subtitle=".STL (max 150MB)"
          @on-change="change"
          @on-drop="drop"
        />
      </div>
    </div>
    <div class="md:hidden mx-6 my-6 flex justify-end gap-3">

      <FileUploadFAB @change="change" />
      <div>
        <div
          class="tooltip tooltip-left"
          :data-tip="capitalizeOnlyFirstLetter($t('checkout'))"
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
import { useLoadingOverlayStore } from "~~/stores/loading_overlay";

const { t } = useI18n();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const filamentSpoolStore = useFilamentSpoolStore();
const filamentInfillStore = useFilamentInfillStore();
const globalsStore = useGlobalsStore();
const loadingOverlayStore = useLoadingOverlayStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

if (
  !filamentInfillStore.getFilamentInfills.length ||
  !filamentSpoolStore.getAll.length
) {
  console.debug(
    "Infills or spools missing. Showing loading overlay until they get fetched"
  );
  loadingOverlayStore.show();
}

const { dimensionUnit, rotationUnit } = storeToRefs(globalsStore);
const { filamentInfills } = storeToRefs(filamentInfillStore);
const { filamentSpools } = storeToRefs(filamentSpoolStore);

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

const eta = computed(() => {
  return printOrderStore.getETA;
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

watch([filamentInfills, filamentSpools], ([newA, newB], [oldA, oldB]) => {
  // Disable loading overlay when all data is fetched
  if (newA.length && newB.length) {
    loadingOverlayStore.close();
  } else {
    loadingOverlayStore.show();
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
        element.name + " " +
        capitalizeOnlyFirstLetter(t('exceeds_limit_of')) + " " +
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
        element.name + " " +
        capitalizeOnlyFirstLetter(t('exceeds_limit_of')) + " " +
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
  dialogStore.open("DialogConfirm", {
    title: capitalizeOnlyFirstLetter(t("are_you_sure")),
    subtitle: capitalizeOnlyFirstLetter(
      t("this_will_remove_all_print_units_from_your_order")
    ),
    onConfirm: () => {
      printOrderStore.clear();
    },
    onDismiss: () => {},
  });
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