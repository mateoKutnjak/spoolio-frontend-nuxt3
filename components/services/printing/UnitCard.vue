<template>
  <div
    class="card md:card-side bg-white rounded-none cursor-pointer border-1 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    @click="$emit('on-item-clicked', unit.localUrl)"
  >
    <div class="card-body gap-5">
      <div class="flex gap-5 justify-between items-center">
        <client-only>
          <PreviewSTL
            class="w-16 h-16 p-0 m-0 border border-gray-400"
            :stlFileUrl="unit.localUrl"
          />
        </client-only>
        <div class="flex flex-col gap-1 flex-1">
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ unit.file.name }}
          </div>
          <ServicesPrintingDimensionInfo :data="unit.modelDimensions" />
          <ServicesPrintingVolumeInfo :data="unit.modelVolume" />
        </div>
        <div class="flex justify-center font-semibold text-lg text-gray-900 dark:text-white">
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
      <div class="flex flex-wrap gap-5 justify-between items-center">

        <div class="font-semibold text-gray-900 dark:text-white">
          <div class="flex items-center">
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
              class="tooltip tooltip-bottom mt-1"
              data-tip="Filament color"
            >
              <div
                class="btn btn-xs btn-circle btn-ghost"
                :style="`background-color: ${getColorValue()}`"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3 mb-1">
          <button
            class="btn btn-sm btn-circle btn-outline border-gray-300 hover:bg-gray-200 hover:border-gray-300"
            @click.stop="decreaseQuantity"
          >
            <Icon
              class="text-gray-500"
              name="ic:round-minus"
              size="16"
            />
          </button>
          <div>
            <input
              type="number"
              v-model="unit.quantity"
              class="bg-gray-50 w-14 h-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1"
              :max="999"
              :min="1"
              required
            >
          </div>
          <button
            class="btn btn-sm btn-circle btn-outline border-gray-300 hover:bg-gray-200 hover:border-gray-300"
            @click.stop="increaseQuantity"
          >
            <Icon
              class="text-gray-500"
              name="ic:round-plus"
              size="16"
            />
          </button>
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
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useDialogStore } from "~~/stores/dialog";
import IFilamentColor, {
  useFilamentColorStore,
} from "~~/stores/filament_color";
import {
  IFilamentInfill,
  useFilamentInfillStore,
} from "~~/stores/filament_infill";
import {
  IFilamentMaterial,
  useFilamentMaterialStore,
} from "~~/stores/filament_material";
import { useGlobalsStore } from "~~/stores/globals";
import {
  IPrintOrderAttachmentFileResponse,
  IPrintOrderAttachmentImageResponse,
  IPrintOrderUnitResponse,
  usePrintOrderStore,
} from "~~/stores/print_order";

const { unit } = defineProps(["unit"]);

const dialogStore = useDialogStore();
const globalsStore = useGlobalsStore();
const filamentColorStore = useFilamentColorStore();
const filamentMaterialStore = useFilamentMaterialStore();
const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const colors = ref<IFilamentColor[]>(filamentColorStore.getFilamentColors);
const materials = ref<IFilamentMaterial[]>(
  filamentMaterialStore.getFilamentMaterials
);
const infills = ref<IFilamentInfill[]>(filamentInfillStore.getFilamentInfills);

const selectedMaterial = ref<number>();
const selectedColor = ref<number>();
const selectedInfill = ref<number>();
const comment = ref<string>("");
const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);

onMounted(() => {
  selectedColor.value = unit.color;
  selectedMaterial.value = unit.material;
  selectedInfill.value = unit.infill;
  comment.value = unit.comment;
  attachmentFiles.value = unit.attachmentFiles || [];
  attachmentImages.value = unit.attachmentImages || [];
});

const fileSize = computed(() => {
  return fileSizeFormatted(unit.file);
});

const totalPrice = computed(() => {
  return printOrderStore.getPriceByLocalUrl(unit.localUrl);
});

function getMaterialName(): string {
  return materials.value.find((el) => el.id === unit.material)?.name || "null";
}

function getInfillPercentage(): number {
  return infills.value.find((el) => el.id === unit.infill)?.percentage || 0;
}

function getColorValue(): string {
  return colors.value.find((el) => el.id === unit.color)?.value || "#000000";
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

watch(filamentColorStore.getFilamentColors, (value, oldValue, onInvalidate) => {
  colors.value = value;
});

watch(
  filamentMaterialStore.getFilamentMaterials,
  (value, oldValue, onInvalidate) => {
    materials.value = value;
  }
);

watch(
  filamentInfillStore.getFilamentInfills,
  (value, oldValue, onInvalidate) => {
    infills.value = value;
  }
);

watch(selectedColor, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { color: value });
});

watch(selectedMaterial, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { material: value });
});

watch(selectedInfill, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { infill: value });
});

watch(comment, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { comment: value });
});

watch(attachmentFiles, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentFiles: value });
});

watch(attachmentImages, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentImages: value });
});

function onColorSelected(color: IFilamentColor) {
  selectedColor.value = color.id;
}

function onInfillSelected(infill: IFilamentInfill) {
  selectedInfill.value = infill.id;
}

function onMaterialSelected(material: IFilamentMaterial) {
  selectedMaterial.value = material.id;
}

function duplicateUnit() {
  printOrderStore.addUnit(<IPrintOrderUnitResponse>{
    id: undefined,
    quantity: unit.quantity,
    color: selectedColor.value,
    material: selectedMaterial.value,
    infill: selectedInfill.value,
    estimatedPrice: unit.estimatedPrice,
    file: unit.file,
    comment: comment.value,
    localUrl: URL.createObjectURL(unit.file),
    attachmentFiles: [], // todo
    attachmentImages: [], // todo
    order: undefined,
    modelDimensions: undefined,
    modelVolume: 0,
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