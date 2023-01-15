<template>
  <div class="card">
    <div class="card-body gap-10">
      <div class="flex gap-12">
        <div class="flex flex-col gap-5">
          <client-only class="flex-1">
            <PreviewSTL2
              class="w-92 h-96 p-0 m-0 border-2 border-gray-400"
              :stlFileUrl="unit.localUrl"
            />
          </client-only>
          <div class="flex-none flex flex-col gap-3">
            <div class="text-lg font-semibold"> {{ unit.file.name }}</div>
            <ServicesPrintingDimensionInfo :data="unit.modelDimensions" />
            <ServicesPrintingVolumeInfo :data="unit.modelVolume" />
          </div>
          <div class="flex-1"></div>
          <div class="flex-none">
            <table class="table table-compact w-full rounded-md border border-1 rounded-md shadow-md">
              <tbody class="">
                <tr>
                  <td class="text-md">ETA</td>
                  <td class="text-md">TODO</td>
                </tr>
                <tr>
                  <td class="text-md">Price per part</td>
                  <td class="text-md">${{ (printOrderStore.getPriceByLocalUrl(unit.localUrl) / unit.quantity).toFixed(2) }}</td>
                </tr>
                <tr>
                  <th class=" text-lg">Total price</th>
                  <th class=" text-lg"> ${{ printOrderStore.getPriceByLocalUrl(unit.localUrl).toFixed(2) }}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ul>
          <li class="my-3">
            <ServicesPrintingDialogMaterialRadioGroup @on-material-selected="onMaterialSelected" />
          </li>
          <li class="my-3">
            <ServicesPrintingDialogInfillRadioGroup @on-infill-selected="onInfillSelected" />
          </li>
          <li class="my-3">
            <ServicesPrintingDialogColorRadioGroup @on-color-selected="onColorSelected" />
          </li>
          <li class="my-1">
            <div class="
              flex
              flex-col
              gap-4">
              <div class="text-sm">4. Quantity</div>
              <div class="flex gap-2 justify-start items-center">
                <button
                  class="btn btn-md btn-circle btn-ghost"
                  @click="decreaseQuantity"
                >
                  <Icon
                    class="text-gray-500"
                    name="ic:round-minus"
                    size="24"
                  />
                </button>
                <div>
                  <input
                    type="number"
                    v-model="quantity"
                    class="bg-gray-50 w-14 h-12 text-xl text-center border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1"
                    :max="999"
                    :min="1"
                    required
                  >
                </div>
                <button
                  class="btn btn-md btn-circle btn-ghost"
                  @click="increaseQuantity"
                >
                  <Icon
                    class="text-gray-500"
                    name="ic:round-plus"
                    size="24"
                  />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="card-actions justify-between">

        <button
          class="btn btn-primary btn-lg btn-block "
          @click="dialogStore.close()"
        >Apply</button>
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

const { props } = defineProps(["props"]);

const unit = props[0]; // todo error check

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