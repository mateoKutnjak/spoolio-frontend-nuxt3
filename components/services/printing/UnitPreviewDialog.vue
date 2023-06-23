<template>
  <div class="card-body gap-10 p-0 m-0">
    <div class="relative flex flex-col">
      <client-only class="flex-1">
        <PreviewSTL
          class="w-92 h-[80vh] p-0 border-gray-400"
          :stlFileUrl="unit.localUrl"
        />
      </client-only>
      <div class="absolute top-4 left-6 max-w-fit">
        <div class="flex flex-col gap-3 items-start">
          <div class="text-2xl text-gray-500 line-clamp-1">{{ extractUrlFileStringUnion(unit.file) }}</div>
          <!-- <RadioGroupDimensionUnit
            :unit="unit"
            :key="unit.length_unit"
          /> -->
          <ServicesPrintingDimensionInfo
            :unit="unit"
          />
          <ServicesPrintingVolumeInfo
            :data="unit.model_volume"
            :unit="unit.length_unit"
          />
          <ServicesPrintingRotationInfo :localUrl="unit.localUrl" />
        </div>
      </div>
      <div class="absolute top-4 right-6 max-w-fit">
        <div class="flex flex-col gap-1 justify-end items-end">
          <ListboxMaterial
            class="w-full"
            :file-url="unit.localUrl"
          />
          <!-- ? :key binding is added to refresh component ListboxColor when material id changes -->
          <ListboxColor
            class="w-full"
            :key="unit.spool.material.id"
            :file-url="unit.localUrl"
          />
          <ListboxInfill
            class="w-full"
            :file-url="unit.localUrl"
          />
          <!-- <ListboxPrintOrderUnitWall
            class="w-full"
            :file-url="unit.localUrl"
          /> -->
        </div>
      </div>
      <div class="absolute bottom-4 left-6">
        <div class="flex justify-between items-start">
          <IncreaseDecreaseQuantityButtons
            :max="MAX_PRINT_QUANTITY"
            :min="1"
            :initialValue="quantity"
            @on-decrease-value="decreaseQuantity"
            @on-increase-value="increaseQuantity"
            @on-value-set="(q) => setQuantity(q)"
          />
        </div>
      </div>
      <div class="absolute bottom-4 right-6">

        <div v-if="price === Number.NEGATIVE_INFINITY">
          <Icon
            class="text-gray-500 -my-6"
            name="eos-icons:three-dots-loading"
            size="70"
          />
        </div>
        <div v-else-if="price === Number.POSITIVE_INFINITY">
          <ButtonRetry @on-click="unit ? printOrderStore.estimateSlicerAndPrintJobs(unit) : () => null" />
        </div>

        <div
          v-else
          class="text-4xl text-gray-700"
        >€{{ (price).toFixed(2)}}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import { IPrintOrderUnit } from "~~/constants/data";
import { usePrintOrderStore } from "~~/stores/print_order";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const printOrderStore = usePrintOrderStore();

const selectedSpool = ref(unit.spool);
const selectedInfill = ref(unit.infill);
const quantity = ref(unit.quantity);
const comment = ref(unit.comment);
const attachmentFiles = ref(unit.attachmentFiles || []);
const attachmentImages = ref(unit.attachmentImages || []);

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