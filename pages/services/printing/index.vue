<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div class="flex flex-col gap-8 justify-between">
      <ServicesPrintingStepsPreview
        class="px-12 md:px-0 pb-12 "
        :current-step-index="0"
        :steps="[$t('import_3d_models'), $t('shipping') + ' ' + $t('and') + ' ' + $t('payment'), $t('finish_order')]"
        :icon-names="['ph:file-arrow-up', 'ph:truck', 'ph:credit-card']"
      />
      <div
        v-if="printOrderStore.getUnits.length"
        class="px-12 md:px-0 flex sm:flex-row flex-col gap-6 jusify-between md:items-center items-start"
      >
        <div class="flex-1 text-stone-600 font-bold text-3xl">{{ $t('print_order').toUpperCase() }}</div>

        <div
          class="btn btn-error btn-outline btn-sm bg-white rounded-md hover:!text-white"
          @click="onClearOrder"
        >
          <Icon
            name="ph:trash"
            size="22"
          />{{ capitalizeOnlyFirstLetter($t('clear_order')).toUpperCase() }}
        </div>
      </div>
      <div
        v-else
        class="px-12 md:px-0 text-stone-600 font-bold text-3xl"
      >{{$t('quick_3d_print').toUpperCase()}}</div>

      <div>
        <div class="flex flex-col gap-8">
          <!-- <div class="w-full hidden lg:block bg-white p-3 shadow-md rounded-lg">
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
              :title="capitalizeOnlyFirstLetter($t('add_3d_model_or_drag_and_drop'))"
              subtitle=".STL (max 150 MB)"
              @on-change="change"
              @on-drop="drop"
            />
          </div> -->

          <div class="md:px-0 px-12 flex lg:flex-row flex-col items-start  gap-8">
            <div class="w-full relative flex flex-col md:flex-row gap-2">
              <div
                v-if="units.length > 0"
                class="w-full flex flex-col gap-4"
              >
                <ServicesPrintingUnitCard
                  v-for="item, index in units"
                  :key="item.localUrl"
                  :unit="item"
                  :index="index"
                  @on-item-clicked="onItemClicked"
                />
                <ContentLoader
                  v-if="itemInsertedLoading"
                  class="w-full"
                  width=""
                  height="370"
                  primary-color="#dddddd"
                  secondary-color="#cccccc"
                  :speed="1.5"
                  preserveAspectRatio="xMidYMid meet"
                ></ContentLoader>
              </div>
              <div v-else>
                <div class="flex flex-col gap-8 text-2xl">
                  <ul class="list-inside space-y-2">
                    <li class="flex gap-2 items-start">
                      <span class="text-primary font-bold">1/</span>
                      <div class="flex flex-wrap gap-2">
                        <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('import_3d_models_in_one_of_the_supported_formats')) }}</span>
                        <NuxtLink :to="localePath('/services/modeling')"><span class="link link-primary font-bold">({{ $t('i_dont_have_a_model').toUpperCase() }})</span>
                        </NuxtLink>
                      </div>
                    </li>
                    <li class="flex gap-2 items-start">
                      <span class="text-primary font-bold">2/</span>
                      <div class="flex flex-wrap">
                        <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('define_the_desired_characteristics')) }}</span>
                      </div>
                    </li>
                    <li class="flex gap-2 items-start">
                      <span class="text-primary font-bold">3/</span>
                      <div class="flex flex-wrap">
                        <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('automatically_find_out_the_price')) }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
            <aside class=" w-full lg:sticky order-last top-8 h-full lg:w-2/3">
              <div class="w-full flex flex-col gap-8">
                <DragAndDropArea
                  class="w-full"
                  :title="capitalizeOnlyFirstLetter($t('add_3d_model_or_drag_and_drop'))"
                  :subtitle="`.STL (max ${MAX_FILE_SIZE_STL/1024/1024}MB)`"
                  @on-change="change"
                  @on-drop="drop"
                />
                <div
                  v-if="printOrderStore.getUnits.length"
                  class="card-body p-6 flex flex-col gap-2 shadow-md rounded-md bg-white border border-stone-300"
                >
                  <div class="overflow-x-auto">
                    <table class="table table-xs">
                      <tbody>
                        <!-- <tr>
                          <th>
                            <div class="text-xl font-semibold"> {{ $t('eta').toUpperCase() }} ({{ $t('without_delivery') }}): </div>
                          </th>
                          <td class="text-right">
                            <ServicesPrintingOrderETA :eta="eta" />
                          </td>
                        </tr> -->
                        <tr>
                          <th>
                            <div class="text-xl font-semibold"> {{ capitalizeOnlyFirstLetter($t('total_price')) }}: </div>
                          </th>
                          <td class="text-right">
                            <ServicesPrintingOrderPrice :total-price="totalPrice" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <NuxtLink
                    :class="`btn gap-1 rounded-md ${units.length && totalPrice !== Number.NEGATIVE_INFINITY && totalPrice !== Number.POSITIVE_INFINITY && eta !== undefined && eta !== null ? 'btn-primary text-white' : 'btn-disabled'}`"
                    :to="localePath('/services/printing/checkout/')"
                  >
                    {{ capitalizeOnlyFirstLetter($t('checkout')).toUpperCase() }}
                    <Icon
                      name="ph:arrow-right-bold"
                      size="20"
                    />
                    <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
                    <!-- <ClientOnly>
                <div> {{ isLoggedIn ? 'Checkout' : 'Checkout as guest'}}</div>
              </ClientOnly> -->
                  </NuxtLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="px-12 md:px-0 md:hidden mx-6 my-6 flex justify-end gap-3">

      <FileUploadFAB @change="change" />
      <div v-if="printOrderStore.units.length > 0">
        <div
          class="tooltip tooltip-left"
          :data-tip="capitalizeOnlyFirstLetter($t('checkout'))"
        >
          <NuxtLink
            class="btn btn-circle  btn-lg shadow-md"
            :class="totalPrice > 0 ? 'btn-primary' : 'btn-disabled'"
            :to="localePath('/services/printing/checkout/')"
          >
            <Icon
              name="ph:shopping-cart"
              size="27"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </div> -->
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
import { usePrintOrderUnitInfillStore } from "~~/stores/print_order_unit_infill";
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { useGlobalsStore } from "~~/stores/globals";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";
import { ContentLoader } from "vue-content-loader";
import { useLoadingOverlayStore } from "~~/stores/loading_overlay";
import { usePrintOrderUnitWallStore } from "~~/stores/print_order_unit_wall";
import { usePrintOrderUnitInfillWallCombinationStore } from "~~/stores/print_order_unit_infill_wall_combination";
import { usePrintingMethodStore } from "~~/stores/printing_method";

const { t } = useI18n();
const localePath = useLocalePath();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const filamentSpoolStore = useFilamentSpoolStore();
const printOrderUnitInfillStore = usePrintOrderUnitInfillStore();
const globalsStore = useGlobalsStore();
const loadingOverlayStore = useLoadingOverlayStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();
const printOrderUnitWallStore = usePrintOrderUnitWallStore();
const printOrderUnitInfillWallCombinationStore =
  usePrintOrderUnitInfillWallCombinationStore();
const printingMethodStore = usePrintingMethodStore();

if (
  !printOrderUnitInfillStore.getInfills.length ||
  !filamentSpoolStore.getAll.length ||
  !printOrderUnitWallStore.getWalls.length ||
  !printOrderUnitWallStore.getWallThicknesses.length ||
  !printOrderUnitInfillWallCombinationStore.getAll.length ||
  !printingMethodStore.getPrintingMethods.length
) {
  loadingOverlayStore.show();
}

const { dimensionUnit, rotationUnit } = storeToRefs(globalsStore);
const { infills } = storeToRefs(printOrderUnitInfillStore);
const { filamentSpools } = storeToRefs(filamentSpoolStore);
const { walls, wallThicknesses } = storeToRefs(printOrderUnitWallStore);
const { infillWallCombinations } = storeToRefs(
  printOrderUnitInfillWallCombinationStore
);
const { printingMethods } = storeToRefs(printingMethodStore);

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
  await printingMethodStore
    .fetch()
    .then(() => {
      console.debug("Printing methods fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

  await filamentSpoolStore
    .fetchFilamentSpools()
    .then(() => {
      console.debug("Spools fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

  await printOrderUnitInfillStore
    .fetchInfills()
    .then(() => {
      console.debug("Infills fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

  await printOrderUnitWallStore
    .fetchWalls()
    .then(() => {
      console.debug("Walls fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

  await printOrderUnitWallStore
    .fetchWallThicknesses()
    .then(() => {
      console.debug("Wall thicknesses fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

  await printOrderUnitInfillWallCombinationStore
    .fetchAll()
    .then(() => {
      console.debug("Infill walls combinations fetched");
    })
    .catch((err) => notificationStore.showFetchError(err));

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

watch(
  [
    infills,
    filamentSpools,
    walls,
    wallThicknesses,
    infillWallCombinations,
    printingMethods,
  ],
  (
    [newA, newB, newC, newD, newE, newF],
    [oldA, oldB, oldC, oldD, oldE, oldF]
  ) => {
    // Disable loading overlay when all data is fetched
    if (
      newA.length &&
      newB.length &&
      newC.length &&
      newD.length &&
      newE.length &&
      newF.length
    ) {
      loadingOverlayStore.close();
    } else {
      loadingOverlayStore.show();
    }
  }
);

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

function clearFilesChrome(input: any) {
  const dt = new DataTransfer();
  dt.items.add(new File([], "a.txt"));
  input.files = dt.files;

  // This will remove the first item when selecting many files
  input.onchange = () => {
    const dt = new DataTransfer();

    for (let file of input.files)
      if (file !== input.files[0]) dt.items.add(file);

    input.onchange = null; // remove event listener
    input.files = dt.files; // this will trigger a change event
  };
}

function clearFilesFirefox(input: any) {
  const cd = new ClipboardEvent("").clipboardData;
  cd!.items.add(new File(["a"], "a.txt"));
  input.files = cd!.files;

  // This will remove the fist item when selecting many files
  input.onchange = () => {
    const dt = new DataTransfer();

    for (let file of input.files)
      if (file !== input.files[0]) dt.items.add(file);

    input.onchange = null; // remove event listener
    input.files = dt.files; // this will trigger a change event
  };
}

function change(e: any) {
  // * Gets triggered when user selects
  // * files after CLICKING on container

  if (!isLoggedIn.value) {
    dialogStore.open("AuthForm", {});
    notificationStore.show(
      "Please log in to use this feature",
      ToastLevelType.info
    );

    clearFilesChrome(e.target);
    clearFilesFirefox(e.target);
    return;
  }

  itemInsertedLoading.value = true;

  console.log(itemInsertedLoading);

  var files = Array.from<File>(e.target.files);

  if (!files.length) {
    itemInsertedLoading.value = false;
    console.log(itemInsertedLoading);
    return;
  }

  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.size > MAX_FILE_SIZE_STL) {
      notificationStore.show(
        element.name +
          " " +
          capitalizeOnlyFirstLetter(t("exceeds_limit_of")) +
          " " +
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
          " " +
          capitalizeOnlyFirstLetter(t("exceeds_limit_of")) +
          " " +
          MAX_FILE_SIZE_STL / 1024 / 1024 +
          " MBs"
      );
      return;
    }
  }
  onFilesAdded(files);
}

function onFilesAdded(files: File[]) {
  if (!isLoggedIn.value) {
    dialogStore.open("AuthForm", {});
    notificationStore.show(
      "Please log in to use this feature",
      ToastLevelType.info
    );
    return;
  }

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
        (localUrl: string) => {
          itemInsertedLoading.value = false;

          navigateTo(
            localePath(
              `/services/printing/units/${urlExtractFilename(localUrl)}`
            )
          );
        },
        capitalizeOnlyFirstLetter(t("unsupported_file_type")) +
          ". " +
          capitalizeOnlyFirstLetter(t("supported_formats")) +
          ": .STL"
      );
    }
  }
}

function onItemClicked(localUrl: string) {
  unit.value = units.value.find((el) => el.localUrl === localUrl);
  isDetailsDialogShown.value = true;

  navigateTo(
    localePath(
      `/services/printing/units/${unit.value?.localUrl.split("/")[3]}/`
    )
  );

  // dialogStore.open(
  //   "ServicesPrintingUnitPreviewDialog",
  //   { unit: unit.value },
  //   "2xl"
  // );
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