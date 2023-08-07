<template>
  <div class="container mx-auto max-w-7xl px-12 py-16">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-12">
        <div class="flex md:flex-row flex-col gap-3">
          <ButtonBack class="text-primary" />
          <div class="flex-1"></div>
          <div
            class="btn btn-sm btn-outline"
            @click.prevent="onSaveChangesClicked"
          >
            <Icon
              name="ph:floppy-disk-fill"
              size="18"
            />{{ ($t('save') + ' ' + $t('and') + ' ' + $t('continue_editing')).toUpperCase() }}
          </div>
          <div
            class="btn btn-primary btn-sm gap-1 text-white"
            @click.prevent="onSaveChangesAndExitClicked"
          >
            <Icon
              name="ph:check-bold"
              size="18"
            />{{ ($t('save') + " " + $t('and') + " " + $t('exit')).toUpperCase() }}
          </div>
        </div>
        <div class="grid md:grid-cols-4 grid-cols-2 gap-8 items-center">

          <div class="text-2xl font-bold text-stone-700 line-clamp-1">{{ extractUrlFileStringUnion(unit.file).toUpperCase()
        }}</div>
          <div class="flex-1"></div>
          <div class="flex flex-col gap-1 items-center">
            <div class="font-medium text-base text-stone-500"> {{ $t('quantity').toUpperCase() }} </div>
            <IncreaseDecreaseQuantity
              class="w-36"
              :max="MAX_PRINT_QUANTITY"
              :min="1"
              :initial-value="unit.quantity"
              :emit-live="false"
              @on-decrease-value="decreaseQuantity"
              @on-increase-value="increaseQuantity"
              @on-value-set="(q) => setQuantity(q) "
            />
          </div>
          <div class="flex flex-col gap-1 items-end">
            <div class="font-medium text-base text-stone-500"> {{ $t('total_price').toUpperCase() }} </div>
            <ServicesPrintingUnitSinglePrice
              class="text-3xl"
              :unit="unit"
              :price="price"
            />
          </div>

        </div>
      </div>

      <div class="py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="flex flex-col gap-4">
          <div class="border border-primary">
            <client-only class="border border-primary">
              <PreviewSTL
                class="p-0 border-gray-400 aspect-video"
                :unit="unit"
              />
            </client-only>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServicesPrintingUnitDimensionForm :unit="unit" />
            <ServicesPrintingUnitOrientationForm :unit="unit" />
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
                :key="unit.printing_method_display.id"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('color')) }}</div>
              <ServicesPrintingUnitColor
                :unit="unit"
                :key="`${unit.printing_method_display.id} ${unit.spool_display.id}`"
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

async function onSaveChangesClicked() {
  if (!unit) {
    throw createError(`onSaveChangesClicked: unit = ${unit}`);
  }

  await printOrderStore.updateUnit(unit.localUrl, {
    spool: unit.spool_display,
    infill: unit.infill_display,
    wall: unit.wall_display,
    wall_thickness: unit.wall_thickness_display,
    infill_wall_combination: unit.infill_wall_combination_display,
    scale: unit.scale_display,
    printing_method: unit.printing_method_display,
    model_rotation: unit.model_rotation_display,
    use_optimal_rotation: unit.use_optimal_rotation_display,
    length_unit: unit.length_unit_display,
  });
}

async function onSaveChangesAndExitClicked() {
  await onSaveChangesClicked();

  if (!unit) {
    throw createError(`onSaveChangesClicked: unit = ${unit}`);
  }

  await printOrderStore.updateScreenshot(unit.localUrl, () => {
    const router = useRouter();
    router.go(-1);
  });
}

onBeforeRouteLeave(() => {
  printOrderStore.updateUnit(unit.localUrl, {
    spool_display: unit.spool,
    infill_display: unit.infill,
    wall_display: unit.wall,
    wall_thickness_display: unit.wall_thickness,
    infill_wall_combination_display: unit.infill_wall_combination,
    scale_display: unit.scale,
    printing_method_display: unit.printing_method,
    model_rotation_display: unit.model_rotation,
    use_optimal_rotation_display: unit.use_optimal_rotation,
    length_unit_display: unit.length_unit,
  });
});
</script>
  
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>