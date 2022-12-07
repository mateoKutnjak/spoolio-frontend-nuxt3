<template>
  <div class="card bg-base-100 shadow-md border-4 border-gray-300 p-8">
    <div class="flex flex-col gap-5">
      <div class="flex gap-5 justify-between text-gray-800">
        <div class="flex gap-3">
          <!-- <Icon
            class="min-w-min"
            :name="icon"
            size="27"
          /> -->
          <p class="card-title text-base break-all">{{data.file.name}}</p>
        </div>

        <div class="flex gap-2">
          <div
            class="tooltip tooltip-bottom"
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
      <div class="grid grid-cols-2 gap-8">
        <button>
          <figure>
            <img
              src="https://placeimg.com/400/300/arch"
              alt="file"
              class="rounded"
            />
          </figure>
        </button>

        <div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Material</span>
            </label>
            <select
              class="select select-bordered select-sm"
              v-model="selectedMaterial"
            >
              <option
                v-for="(material, index) in materials"
                :key="material.name"
                :class="(index == 0) ? 'selected disabled' : ''"
                :value="material.id"
              >{{material.name}} (${{material.price}})</option>
            </select>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Color</span>
            </label>
            <select
              class="select select-bordered select-sm"
              v-model="selectedColor"
            >
              <option
                v-for="color in colors"
                :key="color.name"
                :value="color.id"
              >{{color.name}} ({{color.value}})</option>
            </select>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Infill</span>
            </label>
            <select
              class="select select-bordered select-sm"
              v-model="selectedInfill"
            >
              <option
                v-for="infill in infills"
                :key="infill.percentage"
                :value="infill.id"
              >{{infill.name}} ({{(infill.percentage * 100)}}%)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        Price for this item is estimated at
        <strong>${{data.estimatedPrice}}</strong>
        <div class="dropdown dropdown-end">
          <label
            tabindex="0"
            class="btn btn-circle btn-ghost btn-xs text-info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-4 h-4 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </label>
          <div
            tabindex="0"
            class="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
          >
            <div class="card-body">
              <h2 class="card-title">You needed more info?</h2>
              <p>Here is a description!</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="form-control">
          <textarea
            class="textarea textarea-bordered h-24"
            placeholder="Additional information"
            v-model="comment"
          ></textarea>
        </div>
      </div>
      <input
        type="file"
        class="file-input file-input-bordered w-full max-w-xs"
        multiple
        @change="onAttachmentFilesChange"
      />
      <div class="flex flex-col">
        <div
          v-for="attachmentFile in attachmentFiles"
          :key="attachmentFile.localUrl"
        >
          <div>{{attachmentFile.localUrl}}</div>
        </div>
      </div>
      <div class="card-actions justify-between items-end">
        <div class="flex justify-between items-center">
          <div class="btn-group gap-1 items-center">
            <button
              class="btn btn-outline btn-error btn-square btn-sm text-xl border-0 bg-gray-200"
              @click="decreaseQuantity"
            >-</button>
            <input
              type="text"
              v-model="quantity"
              class="input input-xs w-14 text-lg text-center"
            />
            <!-- <button class="btn btn-ghost btn-sm text-xl">{{quantity}}x</button> -->
            <button
              class="btn btn-outline btn-info btn-square btn-sm text-xl border-0 bg-gray-200"
              @click="increaseQuantity"
            >+</button>
          </div>

        </div>
        <div class="flex gap-2 items-end">
          <strong class="text-2xl"> ${{(quantity * data.estimatedPrice)}}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  IFilamentColor,
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

const colors = ref<IFilamentColor[]>([]);
const materials = ref<IFilamentMaterial[]>([]);
const infills = ref<IFilamentInfill[]>([]);

const selectedMaterial = ref<number>();
const selectedColor = ref<number>();
const selectedInfill = ref<number>();
const quantity = ref<number>(1);
const comment = ref<string>("");
const attachmentFiles = ref<IPrintOrderAttachmentFileResponse[]>([]);
const attachmentImages = ref<IPrintOrderAttachmentImageResponse[]>([]);

onMounted(() => {
  colors.value = filamentColorStore.getFilamentColors;
  materials.value = filamentMaterialStore.getFilamentMaterials;
  infills.value = filamentInfillStore.getFilamentInfills;

  console.log("data.attachedFiles" + data.attachedFiles);

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