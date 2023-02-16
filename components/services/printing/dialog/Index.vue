<template>
  <div class="card-body gap-10 p-0 m-0">
    <div class="relative flex flex-col">
      <client-only class="flex-1">
        <PreviewSTL
          class="w-92 h-[80vh] p-0 border-gray-400"
          :stlFileUrl="unit.localUrl"
        />
      </client-only>
      <div class="absolute top-0 left-0 right-0 py-4 px-6">
        <div class="flex justify-between">
          <div class="flex flex-col gap-3">
            <div class="text-2xl font-light text-gray-500 line-clamp-1">{{ unit.file.name }}</div>
            <ServicesPrintingDimensionInfo :data="unit.modelDimensions" />
            <ServicesPrintingVolumeInfo :data="unit.modelVolume" />
          </div>
          <div class="flex flex-col gap-1 justify-end items-end">
            <ListboxMaterial
              class="w-full"
              :file-url="unit.localUrl"
            />
            <ListboxInfill
              class="w-full"
              :file-url="unit.localUrl"
            />
            <ListboxColor
              class="w-full"
              :file-url="unit.localUrl"
            />
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 px-6 py-2">
        <div class="flex justify-between items-start">
          <IncreaseDecreaseQuantityButtons
            :max="MAX_PRINT_QUANTITY"
            :min="0"
            :initialValue="quantity"
            :key="quantity"
            @on-decrease-value="decreaseQuantity"
            @on-increase-value="increaseQuantity"
            @on-value-set="(q) => setQuantity(q)"
          />
          <div class="text-4xl font-light text-gray-700">${{ price.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
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

const { props } = defineProps(["props"]);

const unit = props[0] as IPrintOrderUnitResponse; // todo error check

const dialogStore = useDialogStore();
const filamentColorStore = useFilamentColorStore();
const filamentMaterialStore = useFilamentMaterialStore();
const filamentInfillStore = useFilamentInfillStore();
const globalsStore = useGlobalsStore();
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
const quantity = ref<number>(1);
const comment = ref<string>("");
const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);

onMounted(() => {
  selectedColor.value = unit.color;
  selectedMaterial.value = unit.material;
  selectedInfill.value = unit.infill;
  comment.value = unit.comment;
  quantity.value = unit.quantity;
  attachmentFiles.value = unit.attachmentFiles || [];
  attachmentImages.value = unit.attachmentImages || [];
});

const price = computed(() => printOrderStore.getPriceByLocalUrl(unit.localUrl));

const fileSize = computed(() => {
  return fileSizeFormatted(unit.file);
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
  quantity.value = Number(quantity.value) + 1;
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value = Number(quantity.value) - 1;
  } else {
    quantity.value = 1;
  }
}

function setQuantity(q: number) {
  quantity.value = q;
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

watch(quantity, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { quantity: value });
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
    quantity: quantity.value,
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
    lengthUnit: DimensionUnit[dimensionUnit.value],
    modelVolume: 0,
    modelDimensions: unit.modelDimensions,
  });
}

function removeUnit() {
  console.log("Deleting unit with URL " + unit.localUrl);

  printOrderStore.removeUnitByFileLocalUrl(unit.localUrl);
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