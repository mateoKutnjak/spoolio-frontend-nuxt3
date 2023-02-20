<template>
  <tr
    class="bg-white cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-48 shadow"
    @click="$emit('on-item-clicked', unit.localUrl)"
  >
    <td class="px-6 pr-16 py-6 w-36">
      <div class="w-36 h-36">
        <nuxt-img
          class="w-36 h-36 p-0 m-0 border border-gray-300 shadow-md"
          :src="unit.screenshotURL"
        >
        </nuxt-img>
      </div>
    </td>
    <td class="py-4">
      <div class="h-36 max-w-xs flex flex-col gap-3 justify-center">
        <div class="text-lg text-gray-900 font-light dark:text-white line-clamp-1">
          {{ unit.file.name }}
        </div>
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
    </td>
    <td class="py-4">
      <div class="flex flex-col gap-2 pb-2">
        <ServicesPrintingDimensionInfo :data="unit.modelDimensions" />
        <ServicesPrintingVolumeInfo :data="unit.modelVolume" />
      </div>
    </td>
    <!-- <td class="py-4 text-center">
      {{ getInfillPercentage() * 100 }}%
    </td> -->
    <!-- <td class="py-4 text-center">
      <div
        class="btn btn-xs btn-circle btn-ghost"
        :style="`background-color: ${getColorValue()}`"
      />
    </td> -->
    <td class="py-4">
      <div class="flex items-center justify-center">
        <input
          type="number"
          class="bg-gray-50 w-14 h-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="unit.quantity"
          @input="updateValue"
          @blur="handleBlur"
          @click.stop.prevent
        />
      </div>
    </td>
    <td class="py-4 px-8 font-semibold text-lg text-gray-900 dark:text-white text-end">
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
    </td>
    <td class="py-4 text-center">
      <div
        class="btn btn-md btn-circle btn-ghost text-gray-400"
        @click.stop.prevent="duplicateUnit"
      >
        <Icon
          name="majesticons:duplicate"
          size="24"
        />
      </div>
      <div
        class="btn btn-md btn-circle btn-ghost text-error"
        @click.stop.prevent="removeUnit"
      >
        <Icon
          name="material-symbols:delete"
          size="24"
        />
      </div>
    </td>
  </tr>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import { useDialogStore } from "~~/stores/dialog";
import {
  IFilamentInfill,
  useFilamentInfillStore,
} from "~~/stores/filament_infill";
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { useGlobalsStore } from "~~/stores/globals";
import {
  IPrintOrderAttachmentFileResponse,
  IPrintOrderAttachmentImageResponse,
  IPrintOrderUnitResponse,
  usePrintOrderStore,
} from "~~/stores/print_order";

const { unit } = defineProps<{
  unit: IPrintOrderUnitResponse;
}>();

const dialogStore = useDialogStore();
const globalsStore = useGlobalsStore();
const filamentSpoolStore = useFilamentSpoolStore();
const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const infills = ref<IFilamentInfill[]>(filamentInfillStore.getFilamentInfills);

const comment = ref<string>("");
const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);

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
    return (
      filamentSpoolStore.getById(printOrderUnit.value.spool)?.material.name ||
      "null"
    );
  }
  console.error("Print order unit is null when displaying material name");
  return "null";
}

function getInfillPercentage(): number {
  return infills.value.find((el) => el.id === unit.infill)?.percentage || 0;
}

function getColorName(): string {
  if (printOrderUnit.value) {
    return (
      filamentSpoolStore.getById(printOrderUnit.value!.spool)?.color.name ||
      "null"
    );
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
  printOrderStore.addUnit(<IPrintOrderUnitResponse>{
    id: undefined,
    quantity: unit.quantity,
    spool: unit.spool,
    infill: unit.infill,
    estimatedPrice: unit.estimatedPrice,
    file: unit.file,
    comment: comment.value,
    localUrl: URL.createObjectURL(unit.file),
    attachmentFiles: [], // todo
    attachmentImages: [], // todo
    order: unit.order,
    modelDimensions: unit.modelDimensions,
    modelVolume: unit.modelVolume,
    screenshotURL: unit.screenshotURL,
    lengthUnit: DimensionUnit[dimensionUnit.value],
  });
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

    attachmentFiles.value.push(<IPrintOrderAttachmentFileResponse>{
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