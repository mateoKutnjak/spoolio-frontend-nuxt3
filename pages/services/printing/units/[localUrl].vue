<template>
  <div class="container mx-auto">
    <div class="flex flex-col relative">

      <!-- Command Bar Part -->

      <div class="flex flex-col lg:gap-1 gap-2 border-b-2 border-primary pt-8 pb-5 sticky top-[68px] bg-base-100 z-10">

        <ButtonBack class="text-primary" />

        <div class="flex justify-between">

          <div class="flex lg:flex-row flex-col lg:gap-20 lg:grow justify-between">
            <div class="text-2xl font-bold line-clamp-1 max-w-[400px] lg:self-end mb-5 lg:mb-0 truncate">{{ extractUrlFileStringUnion(unit.file).toUpperCase()}}</div>
            
            <div class="flex md:flex-row flex-col gap-5 lg:mr-16">
              <div class="flex md:flex-col gap-1 items-center">
                <div class="font-medium text-base text-stone-500"> {{ $t('quantity').toUpperCase() }}</div>
                <IncreaseDecreaseQuantity
                  class="w-36"
                  :max="MAX_PRINT_QUANTITY"
                  :min="1"
                  :initial-value="unit.quantity"
                  :emit-live="true"
                  @on-decrease-value="decreaseQuantity"
                  @on-increase-value="increaseQuantity"
                  @on-value-set="(q) => setQuantity(q) "
                />
              </div>

              <div class="flex md:flex-col items-center">
                <div class="font-medium text-base text-stone-500"> {{ $t('price').toUpperCase() }} </div>
                <ServicesPrintingUnitSinglePrice
                  class="text-3xl"
                  :unit="unit"
                  :price="price"
                />
              </div>
            </div>

            <div class="lg:flex hidden lg:flex-row flex-col gap-1 items-end">
              <div
                class="btn btn-primary btn-sm gap-1 text-white"
                @click.prevent="onSaveChangesClicked"
              >
                <Icon
                  name="ph:floppy-disk-fill"
                  size="18"
                />{{ ($t('save')).toUpperCase() }}
              </div>
              <div
                class="btn btn-primary btn-sm gap-1 text-white"
                @click.prevent="removeUnit"
              >
                <Icon
                  name="ph:trash"
                  size="18"
                />{{ ($t('delete')).toUpperCase() }}
              </div>
            </div>

          </div>

          <div class="flex lg:hidden md:flex-row flex-col gap-1 items-end self-end">
            <div
              class="btn btn-primary btn-sm gap-1 text-white"
              @click.prevent="onSaveChangesClicked"
            >
              <Icon
                name="ph:floppy-disk-fill"
                size="18"
              />{{ ($t('save')).toUpperCase() }}
            </div>
            <div
              class="btn btn-primary btn-sm gap-1 text-white"
              @click.prevent="removeUnit"
            >
              <Icon
                name="ph:trash"
                size="18"
              />{{ ($t('delete')).toUpperCase() }}
            </div>
          </div>
                  
        </div>
      </div>

      <!-- Content Part -->

      <div class="py-12 mx-[4px] grid grid-cols-1 lg:grid-cols-2 gap-12">

        <!-- Left side -->
        <div class="flex flex-col gap-8">
          <div class="border-2 border-primary rounded-md">
            <client-only class="border border-primary">
              <PreviewSTL2
                class="p-0 aspect-video"
                :unit="unit"
              />
            </client-only>
          </div>
          <div class="grid grid-cols-1 gap-10">
            <ServicesPrintingUnitDimensionForm :unit="unit" />
            <ServicesPrintingUnitOrientationForm :unit="unit" />
          </div>

        </div>

        <!-- Right side -->
        <div class="flex flex-col gap-2">

          <div class="text-base-content font-bold text-2xl">{{ $t('printing_method').toUpperCase() }}</div>
          <ServicesPrintingMethodRadio :unit="unit" />

          <div class="mt-4 text-base-content font-bold text-2xl">{{ $t('material').toUpperCase() }}</div>
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

          <div class="mt-4 text-base-content font-bold text-2xl">{{ $t('mechanical_properties').toUpperCase() }}</div>
          <ServicesPrintingUnitMechanicalProperties :unit="unit" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useDialogStore } from "~~/stores/dialog";

const { t } = useI18n();

const router = useRouter();

const { localUrl } = useRoute().params;

if (typeof localUrl !== "string") {
  console.debug(`localUrl parameter (${localUrl}) is not of type string`);
  throw createError("localUrl parameter is not of type string");
}

const printOrderStore = usePrintOrderStore();
const dialogStore = useDialogStore();

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

async function removeUnit() {
  dialogStore.open("DialogConfirm", {
    title: capitalizeOnlyFirstLetter(t("are_you_sure")),
    subtitle: capitalizeOnlyFirstLetter(
      t("this_will_remove_print_unit_from_your_order")
    ),
    onConfirm: () => {
      if (!unit){
        throw createError(`onRemoveUnitClicked: unit = ${unit}`);
      }else{
        printOrderStore.removeUnitByFileLocalUrl(unit.localUrl);
        router.back();
      }      
    },
    onDismiss: () => {},
  });
}

async function onSaveChangesClicked() {
  if (!unit) {
    throw createError(`onSaveChangesClicked: unit = ${unit}`);
  }

  console.log(unit.model_xyz_rotation);

  printOrderStore.updateUnit(unit.localUrl, {
    spool: unit.spool_display,
    infill: unit.infill_display,
    wall: unit.wall_display,
    wall_thickness: unit.wall_thickness_display,
    infill_wall_combination: unit.infill_wall_combination_display,
    scale: unit.scale_display,
    printing_method: unit.printing_method_display,
    model_rotation: unit.model_xyz_rotation,
    use_optimal_rotation: unit.use_optimal_rotation_display,
    length_unit: unit.length_unit_display,
  });

  await printOrderStore.updateScreenshot(unit.localUrl, () => {return}); 
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