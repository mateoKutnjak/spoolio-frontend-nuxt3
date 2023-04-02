<template>
  <tr
    class="bg-white cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-48"
    @click="$emit('on-item-clicked', unit.localUrl)"
  >
    <td class="px-6 pr-16 py-6 w-48">
      <div class="w-48 h-48">
        <nuxt-img
          class="w-48 h-48 p-0 m-0 border border-gray-300"
          :src="unit.screenshotURL"
        >
        </nuxt-img>
      </div>
    </td>
    <td class="py-4">
      <div class="h-48 max-w-xs flex flex-col gap-4 justify-center">
        <div class="text-lg text-gray-900 dark:text-white line-clamp-1">
          {{ extractUrlFileStringUnion(unit.file) }}
        </div>
        <div class="flex flex-col gap-1">
          <ServicesPrintingDimensionInfo
            :data="vector3Parse(unit.model_dimensions)"
            :unit="unit.length_unit"
          />
          <ServicesPrintingVolumeInfo
            :data="unit.model_volume"
            :unit="unit.length_unit"
          />
          <ServicesPrintingRotationPreview
            :key="unit.model_rotation"
            :data="unit.model_rotation"
            :unit="unit.rotation_unit"
          />
        </div>
        <div class="flex gap-2 items-center justify-start">
          <AttributeItem
            :title="getMaterialName()"
            tooltip="Filament material"
          />
          <AttributeItem
            :title="(getInfillPercentage() * 100).toString() + '%'"
            tooltip="Infill percentage"
          />
          <AttributeItem
            :title="getColorName()"
            tooltip="Material color"
          />
        </div>
      </div>
    </td>
    <td class="py-4">
      <div class="mb-4 flex flex-col gap-1 items-center justify-center">
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
      <div class="flex justify-center text-xl text-gray-700 dark:text-white">
        <div
          v-if="totalPrice >= 0"
          class="flex gap-1 items-center"
        >€{{ (totalPrice).toFixed(2)}}
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
          name="lucide:copy"
          size="24"
        />
      </div>
      <div
        class="btn btn-md btn-circle btn-ghost text-error"
        @click.stop.prevent="removeUnit"
      >
        <Icon
          name="lucide:trash-2"
          size="24"
        />
      </div>
    </td>
  </tr>
</template>
  
  <script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IFilamentInfill,
  IPrintOrderUnit,
} from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { usePrintOrderStore } from "~~/stores/print_order";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const dialogStore = useDialogStore();
const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

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
      estimated_price: unit.estimated_price,
      file: unit.file,
      comment: comment.value,
      localUrl: URL.createObjectURL(unit.file),
      attachmentFiles: [], // todo
      attachmentImages: [], // todo
      order: unit.order,
      model_dimensions: unit.model_dimensions,
      model_volume: unit.model_volume,
      model_rotation: unit.model_rotation,
      optimal_rotation: unit.optimal_rotation,
      use_optimal_rotation: unit.use_optimal_rotation,
      screenshotURL: unit.screenshotURL,
      length_unit: unit.length_unit,
      rotation_unit: unit.rotation_unit,
      estimated_time: unit.estimated_time,
    });
  } else {
    throw createError(
      `Cannot duplicate print order unit. Original unit.file is not of type File`
    );
  }
}

function removeUnit() {
  dialogStore.open("DialogConfirmDeletePrintOrderUnit", {
    localUrl: unit.localUrl,
  });
}
</script>
  
  <style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>