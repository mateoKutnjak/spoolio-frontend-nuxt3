<template>
  <div class="card bg-white shadow-sm rounded-2xl border border-gray-300">
    <div class="card-body flex flex-col gap-5 py-6">
      <div class="card-title justify-between">
        <h1 class="text-lg font-bold ,">{{data.file.name}}</h1>
        <div class="flex gap-2">
          <div
            class="tooltip tooltip-bottom z-10"
            data-tip="Duplicate"
          >
            <div
              class="btn btn-ghost btn-square btn-sm"
              @click="duplicateUnit"
            >
              <Icon
                name="material-symbols:content-copy-outline-rounded"
                size="24"
              />
            </div>
          </div>
          <div
            class="btn btn-ghost btn-square btn-sm"
            @click="removeUnit"
          >
            <Icon
              name="material-symbols:close"
              size="27"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex flex-col gap-3 items-center">
          <ClientOnly>
            <button>
              <PreviewSTL2
                class="h-[10rem] w-[10rem]"
                :stlFileUrl="data.localUrl"
              />
            </button>
          </ClientOnly>

          <div>
            <h1 class="text-xs">TODO 6.4cm x 3.2cm x 15cm</h1>
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-2 justify-start items-stretch">
          <ListboxMaterial
            :filament-material-id="data.material"
            @on-selected="onMaterialSelected"
          />
          <ListboxInfill
            :filament-infill-id="data.infill"
            @on-infill-selected="onInfillSelected"
          />
          <ListboxColor
            :filament-color-id="data.color"
            @on-selected="onColorSelected"
          />
        </div>
      </div>
      <div class="divider h-0 m-0"></div>
      <div class="card-actions justify-between items-end">
        <div class="flex items-center">
          <button
            class="btn btn-outline btn-circle btn-sm text-xl text-gray-400 border-gray-400"
            @click="decreaseQuantity"
          >-</button>
          <input
            type="text"
            v-model="quantity"
            class="input input-xs w-14 text-lg text-center"
          />
          <!-- <button class="btn btn-ghost btn-sm text-xl">{{quantity}}x</button> -->
          <button
            class="btn btn-outline btn-circle btn-sm text-xl text-gray-400 border-gray-400"
            @click="increaseQuantity"
          >+</button>
        </div>
        <div class="text-3xl font-bold">
          ${{data.estimatedPrice * quantity}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
import {
  IPrintOrderAttachmentFileResponse,
  IPrintOrderAttachmentImageResponse,
  IPrintOrderUnitResponse,
  usePrintOrderStore,
} from "~~/stores/print_order";

const { data } = defineProps(["data"]);

const filamentColorStore = useFilamentColorStore();
const filamentMaterialStore = useFilamentMaterialStore();
const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

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
  selectedColor.value = data.color;
  selectedMaterial.value = data.material;
  selectedInfill.value = data.infill;
  comment.value = data.comment;
  quantity.value = data.quantity;
  attachmentFiles.value = data.attachmentFiles || [];
  attachmentImages.value = data.attachmentImages || [];
});

const fileSize = computed(() => {
  return fileSizeFormatted(data.file);
});

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
  printOrderStore.updateUnit(data.localUrl, { color: value });
});

watch(selectedMaterial, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { material: value });
});

watch(selectedInfill, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { infill: value });
});

watch(quantity, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { quantity: value });
});

watch(comment, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { comment: value });
});

watch(attachmentFiles, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { attachmentFiles: value });
});

watch(attachmentImages, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(data.localUrl, { attachmentImages: value });
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
    estimatedPrice: data.estimatedPrice,
    file: data.file,
    comment: comment.value,
    localUrl: URL.createObjectURL(data.file),
    attachmentFiles: [], // todo
    attachmentImages: [], // todo
    order: undefined,
  });
}

function removeUnit() {
  console.log("Deleting unit with URL " + data.localUrl);

  printOrderStore.removeUnitByFileLocalUrl(data.localUrl);
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

<style>
</style>