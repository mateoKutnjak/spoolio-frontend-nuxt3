<template>
  <div class="mx-auto max-w-5xl">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <ButtonBack class="text-primary" />
        <div class="flex gap-24 justify-between items-end">
          <div class="text-lg font-bold text-stone-700 line-clamp-1">{{ extractUrlFileStringUnion(unit.file).toUpperCase()
        }}</div>
          <div class="flex flex-col gap-1 items-center">
            <div class="text-sm text-stone-700">{{ capitalizeFirstLetter($t('quantity')) }}</div>
            <IncreaseDecreaseQuantityButtons
              :max="MAX_PRINT_QUANTITY"
              :min="1"
              :initialValue="quantity"
              @on-decrease-value="decreaseQuantity"
              @on-increase-value="increaseQuantity"
              @on-value-set="(q) => setQuantity(q)"
            />
          </div>
          <div class="flex flex-col gap-1 items-center">
            <div class="text-sm text-stone-700">{{ capitalizeFirstLetter($t('price')) }}</div>
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
              class="text-xl font-bold text-gray-700"
            >€{{ (price).toFixed(2) }}
            </div>
          </div>
          <div class="btn btn-primary btn-sm gap-1 text-white">
            <Icon
              name="lucide:check"
              size="18"
            />{{ capitalizeOnlyFirstLetter($t('save')) }}
          </div>
        </div>
      </div>

      <div class="py-12 grid grid-cols-2 gap-12">
        <div class="flex flex-col gap-4">
          <div class="border border-primary">
            <client-only class="border border-primary">
              <PreviewSTL
                class="p-0 border-gray-400 aspect-video"
                :unit="unit"
              />
            </client-only>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <ServicesPrintingUnitDimensionForm :unit="unit" />
            <ServicesPrintingUnitOrientationForm :unit="unit" />
          </div>
          <div class="flex flex-col">
            TODO implement scaling
            TODO save length/rotation in mms/degrees
            TODO check if model fits the printer
          </div>

        </div>
        <div class="flex flex-col gap-2">

          <div class="text-stone-700 font-bold">{{ $t('printing_method').toUpperCase() }}</div>
          <ServicesPrintingMethodRadio :unit="unit" />

          <div class="mt-4 text-stone-700 font-bold">{{ $t('material').toUpperCase() }}</div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col">
              <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('type_of_plastics')) }}</div>
              <ServicesPrintingUnitMaterial
                :unit="unit"
                :key="unit.printing_method.id"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('color')) }}</div>
              <ServicesPrintingUnitColor
                :unit="unit"
                :key="`${unit.spool.id}`"
              />
            </div>
          </div>

          <div class="mt-4 text-stone-700 font-bold">{{ $t('mechanical_properties').toUpperCase() }}</div>
          <ServicesPrintingUnitMechanicalProperties :unit="unit" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import { usePrintOrderStore } from "~~/stores/print_order";

const { localUrl } = useRoute().params;

if (typeof localUrl !== "string") {
  console.debug(`localUrl parameter (${localUrl}) is not of type string`);
  throw createError("localUrl parameter is not of type string");
}

const printOrderStore = usePrintOrderStore();

const unit = printOrderStore.getUnitByLocalUrl(localUrl);

if (!unit) {
  console.debug(`Print order unit with localUrl=${localUrl} is not found`);
  throw createError(`Print order unit with localUrl=${localUrl} is not found`);
}

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