<template>
  <div
    class="card sm:card-side bg-white rounded-none cursor-pointer border border-gray-300 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    @click="$emit('on-item-clicked', unit.localUrl)"
  >
    <div class="sm:m-6 h-44 w-full sm:w-44 bg-[#EAEAEA] flex justify-center">
      <nuxt-img
        class="h-44 w-44 p-0 m-0 sm:border sm:border-gray-300 sm:shadow-md"
        :src="unit.screenshotURL"
      >
      </nuxt-img>
    </div>
    <div class="card-body">
      <div class="flex flex-col flex-1">
        <div class="flex flex-col flex-1 gap-4 justify-between">
          <div class="flex">
            <div class="flex-1 text-lg text-gray-900 font-light dark:text-white line-clamp-1 m">
              {{ extractFilenameFileStringUnion(unit.file) }}
            </div>
            <div>
              <button
                class="btn btn-md btn-circle btn-ghost text-gray-400"
                @click.stop="duplicateUnit"
              >
                <Icon
                  name="majesticons:duplicate"
                  size="24"
                />
              </button>
              <button
                class="btn btn-md btn-circle btn-ghost text-red-600"
                @click.stop="removeUnit"
              >
                <Icon
                  name="material-symbols:delete"
                  size="24"
                />
              </button>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div class="flex flex-col gap-2 justify-between">
              <div class="text-sm text-left text-gray-500 dark:text-white mb-2">
                <div class="flex items-start justify-start">
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Filament material"
                  >{{ getMaterialName() }}</div>
                  <Icon
                    name="bi:dot"
                    size="20"
                  />
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Infill percentage"
                  >{{ getInfillPercentage() * 100 }}%</div>
                  <Icon
                    name="bi:dot"
                    size="20"
                  />
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Material color"
                  >{{ getColorName() }}</div>
                </div>
              </div>
              <ServicesPrintingDimensionInfo :data="vector3Parse(unit.model_dimensions)" />
              <ServicesPrintingVolumeInfo :data="unit.model_volume" />
            </div>
            <div class="flex flex-wrap gap-8 justify-end items-center">

              <input
                type="number"
                class="bg-gray-50 w-14 h-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="unit.quantity"
                @input="updateValue"
                @blur="handleBlur"
                @click.stop.prevent
              />
              <div class="flex justify-center font-light text-xl text-gray-900 dark:text-white">
                <div
                  v-if="totalPrice >= 0"
                  class="flex gap-1 items-center"
                >${{totalPrice.toFixed(2)}}
                </div>
                <div v-else>
                  <Icon
                    class="text-gray-500"
                    name="eos-icons:three-dots-loading"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IFilamentInfill,
  IPrintOrderUnit,
} from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { useGlobalsStore } from "~~/stores/globals";
import { usePrintOrderStore } from "~~/stores/print_order";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const dialogStore = useDialogStore();
const globalsStore = useGlobalsStore();
const filamentSpoolStore = useFilamentSpoolStore();
const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const infills = ref<IFilamentInfill[]>(filamentInfillStore.getFilamentInfills);

const comment = ref<string>("");
const attachmentFiles = ref<IAttachmentFile[]>([]);
const attachmentImages = ref<IAttachmentImage[]>([]);

const printOrderUnit = computed(() =>
  printOrderStore.getUnitByLocalUrl(unit.localUrl)
);

onMounted(() => {
  comment.value = unit.comment;
  attachmentFiles.value = unit.attachmentFiles || [];
  attachmentImages.value = unit.attachmentImages || [];
});

const totalPrice = computed(() => {
  return printOrderStore.getPriceByLocalUrl(unit.localUrl);
});

function getMaterialName(): string {
  if (printOrderUnit.value) {
    return printOrderUnit.value.spool.material.name;
  }
  console.error("Print order unit is null when displaying material name");
  return "null";
}

function getInfillPercentage(): number {
  return unit.infill.percentage;
}

function getColorName(): string {
  if (printOrderUnit.value) {
    return printOrderUnit.value.spool.color.name;
  }
  console.error("Print order unit is null when displaying material name");
  return "null";
}

function increaseQuantity() {
  printOrderStore.updateUnit(unit.localUrl, { quantity: unit.quantity + 1 });
}

function decreaseQuantity() {
  if (unit.quantity > 1) {
    printOrderStore.updateUnit(unit.localUrl, { quantity: unit.quantity - 1 });
  } else {
    printOrderStore.updateUnit(unit.localUrl, { quantity: 1 });
  }
}

function updateValue(event: Event) {
  let value = (event.target as HTMLInputElement).value;

  if (value == "") {
    // * When empty string do nothing. Dont update pinia or manipulate input
    return;
  }

  const numValue = Number(value);

  if (numValue < 1) {
    (event.target as HTMLInputElement).value = "1";
  }

  if (numValue > MAX_PRINT_QUANTITY) {
    (event.target as HTMLInputElement).value = MAX_PRINT_QUANTITY.toString();
  }

  value = (event.target as HTMLInputElement).value;

  printOrderStore.updateUnit(unit.localUrl, { quantity: Number(value) });
}

function handleBlur(event: Event) {
  let value = (event.target as HTMLInputElement).value;

  const numValue = Number(value);

  if (value == "") {
    (event.target as HTMLInputElement).value = "1";
    printOrderStore.updateUnit(unit.localUrl, { quantity: Number(value) });
    return;
  }

  if (numValue < 1) {
    (event.target as HTMLInputElement).value = "1";
  }

  if (numValue > MAX_PRINT_QUANTITY) {
    (event.target as HTMLInputElement).value = MAX_PRINT_QUANTITY.toString();
  }
}

watch(
  filamentInfillStore.getFilamentInfills,
  (value, oldValue, onInvalidate) => {
    infills.value = value;
  }
);

watch(comment, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { comment: value });
});

watch(attachmentFiles, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentFiles: value });
});

watch(attachmentImages, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentImages: value });
});

function duplicateUnit() {
  if (unit.file instanceof File) {
    printOrderStore.addUnit(<IPrintOrderUnit>{
      id: undefined,
      quantity: unit.quantity,
      spool: unit.spool,
      infill: unit.infill,
      estimatedPrice: unit.estimated_price,
      file: unit.file,
      comment: comment.value,
      localUrl: URL.createObjectURL(unit.file),
      attachmentFiles: [], // todo
      attachmentImages: [], // todo
      order: unit.order,
      model_dimensions: unit.model_dimensions,
      model_volume: unit.model_volume,
      screenshotURL: unit.screenshotURL,
      length_unit: unit.length_unit,
      estimated_price: unit.estimated_price,
    });
  } else {
    throw createError(
      `Cannot duplicate print order unit. Original unit.file is not of type File`
    );
  }
}

function removeUnit() {
  dialogStore.open("DialogConfirmDeletePrintOrderUnit", [unit.localUrl]);
}

function onAttachmentFilesChange(e: any) {
  console.log("HERE");
  console.log(attachmentFiles.value);

  var files = Array.from<File>(e.target.files);
  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    // todo if file is image put is in attachmentImages

    attachmentFiles.value.push(<IAttachmentFile>{
      file: element,
      localUrl: URL.createObjectURL(element),
      comment: "EMPTY TODO",
    });
  }
}
</script>
  
  <style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>