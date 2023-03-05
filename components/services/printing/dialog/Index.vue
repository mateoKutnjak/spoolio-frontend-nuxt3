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
            <div class="text-2xl font-light text-gray-500 line-clamp-1">{{ extractUrlFileStringUnion(unit.file) }}</div>
            <ServicesPrintingDimensionInfo :data="vector3Parse(unit.model_dimensions)" />
            <ServicesPrintingVolumeInfo :data="unit.model_volume" />
          </div>
          <div class="flex flex-col gap-1 justify-end items-end">
            <ListboxSpool
              class="w-full"
              :file-url="unit.localUrl"
            />
            <ListboxInfill
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
          <div class="text-4xl font-light text-gray-700">${{ (price).toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IFilamentInfill,
  IFilamentSpool,
  IPrintOrderUnit,
} from "~~/constants/data";
import { usePrintOrderStore } from "~~/stores/print_order";

const { props } = defineProps(["props"]);

const unit = props[0] as IPrintOrderUnit; // todo error check

const printOrderStore = usePrintOrderStore();

const selectedSpool = ref<IFilamentSpool>();
const selectedInfill = ref<IFilamentInfill>();
const quantity = ref<number>(1);
const comment = ref<string>("");
const attachmentFiles = ref<IAttachmentFile[]>([]);
const attachmentImages = ref<IAttachmentImage[]>([]);

onMounted(() => {
  selectedSpool.value = unit.spool;
  selectedInfill.value = unit.infill;
  comment.value = unit.comment;
  quantity.value = unit.quantity;
  attachmentFiles.value = unit.attachmentFiles || [];
  attachmentImages.value = unit.attachmentImages || [];
});

const price = computed(() => printOrderStore.getPriceByLocalUrl(unit.localUrl));

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

watch(selectedSpool, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { spool: value });
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
</script>
  
  <style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>