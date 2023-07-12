<template>
  <div
    class="card sm:card-side bg-white rounded-none cursor-pointer border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    @click="$emit('on-item-clicked', unit.localUrl)"
  >
    <div class="sm:m-6 h-44 w-full sm:w-44 bg-[#EAEAEA] flex justify-center">
      <nuxt-img
        class="h-44 w-44 p-0 m-0 sm:border sm:border-gray-300"
        :src="unit.screenshotURL"
      >
      </nuxt-img>
    </div>
    <div class="card-body">
      <div class="flex flex-col flex-1">
        <div class="flex flex-col flex-1 gap-4 justify-between">
          <div class="flex">
            <div class="flex-1 text-lg text-gray-900 dark:text-white line-clamp-1 m">
              {{ extractUrlFileStringUnion(unit.file) }}
            </div>
            <div>
              <button
                class="btn btn-md btn-circle btn-ghost text-gray-400"
                @click.stop="duplicateUnit"
              >
                <Icon
                  name="lucide:copy"
                  size="24"
                />
              </button>
              <button
                class="btn btn-md btn-circle btn-ghost text-red-600"
                @click.stop="removeUnit"
              >
                <Icon
                  name="lucide:trash-2"
                  size="24"
                />
              </button>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div class="flex flex-col gap-2 justify-between">
              <div class="text-sm text-left text-gray-500 dark:text-white mb-2">
                <div class="flex gap-2 items-start justify-start">
                  <AttributeItem
                    :title="getMaterialName()"
                    :tooltip="capitalizeOnlyFirstLetter($t('filament_material'))"
                  />
                  <AttributeItem
                    :title="(getInfillPercentage() * 100).toString() + '%'"
                    :tooltip="capitalizeOnlyFirstLetter($t('infill_percentage'))"
                  />
                  <AttributeItem
                    :title="getColorName()"
                    :tooltip="capitalizeOnlyFirstLetter($t('filament_color'))"
                  />
                </div>
              </div>
              <ServicesPrintingDimensionInfo :unit="unit" />
              <ServicesPrintingVolumeInfo
                :data="unit.model_volume"
                :unit="unit.length_unit"
              />
              <ServicesPrintingRotationPreview
                :key="unit.model_rotation"
                :data="unit.model_rotation"
                :unit="unit.rotation_unit"
              />
            </div>
            <div class="flex flex-wrap gap-8 justify-end items-end">
              <div class="flex flex-col gap-1 items-center justify-center">
                <div class="text-sm text-gray-400">{{ capitalizeOnlyFirstLetter($t('quantity')) }}</div>
                <input
                  type="number"
                  class="bg-gray-50 w-14 h-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  v-model="unit.quantity"
                  @input="updateValue"
                  @blur="handleBlur"
                  @click.stop.prevent
                />
              </div>
              <div class="flex justify-center text-xl text-gray-700 font-semibold">
                <div v-if="totalPrice === Number.NEGATIVE_INFINITY">
                  <Icon
                    class="text-gray-500 -my-10"
                    name="eos-icons:three-dots-loading"
                    size="50"
                  />
                </div>
                <div v-else-if="totalPrice === Number.POSITIVE_INFINITY">
                  <ButtonRetry @on-click="printOrderUnit ? printOrderStore.estimateSlicerAndPrintJobs(unit) : () => null" />
                </div>
                <div
                  v-else
                  class="flex gap-1 items-center"
                >€{{ (totalPrice).toFixed(2)}}
                </div>
              </div>
            </div>
          </div>
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
  IPrintOrderUnit,
} from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { useGlobalsStore } from "~~/stores/globals";
import { usePrintOrderStore } from "~~/stores/print_order";

const { t } = useI18n();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const dialogStore = useDialogStore();
const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();

const comment = ref<string>("");
const attachmentFiles = ref<IAttachmentFile[]>([]);
const attachmentImages = ref<IAttachmentImage[]>([]);

const printOrderUnit = computed(() =>
  printOrderStore.getUnitByLocalUrl(unit.localUrl)
);

onMounted(() => {
  comment.value = unit.comment;
  attachmentFiles.value = unit.attachmentFiles || [];
  attachmentImages.value = unit.attachmentImages || [];
});

const totalPrice = computed(() => {
  return printOrderStore.getPriceByLocalUrl(unit.localUrl);
});

function getMaterialName(): string {
  if (printOrderUnit.value) {
    return printOrderUnit.value.spool.material.name;
  }
  console.error("Print order unit is null when displaying material name");
  return "null";
}

function getInfillPercentage(): number {
  return unit.infill.percentage;
}

function getColorName(): string {
  if (printOrderUnit.value) {
    return printOrderUnit.value.spool.color.name;
  }
  console.error("Print order unit is null when displaying material name");
  return "null";
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

function updateValue(event: Event) {
  let value = (event.target as HTMLInputElement).value;

  if (value == "") {
    // * When empty string do nothing. Dont update pinia or manipulate input
    return;
  }

  const numValue = Number(value);

  if (numValue < 1) {
    (event.target as HTMLInputElement).value = "1";
  }

  if (numValue > MAX_PRINT_QUANTITY) {
    (event.target as HTMLInputElement).value = MAX_PRINT_QUANTITY.toString();
  }

  value = (event.target as HTMLInputElement).value;

  printOrderStore.updateUnit(unit.localUrl, { quantity: Number(value) });
}

function handleBlur(event: Event) {
  let value = (event.target as HTMLInputElement).value;

  const numValue = Number(value);

  if (value == "") {
    (event.target as HTMLInputElement).value = "1";
    printOrderStore.updateUnit(unit.localUrl, { quantity: Number(value) });
    return;
  }

  if (numValue < 1) {
    (event.target as HTMLInputElement).value = "1";
  }

  if (numValue > MAX_PRINT_QUANTITY) {
    (event.target as HTMLInputElement).value = MAX_PRINT_QUANTITY.toString();
  }
}

watch(comment, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { comment: value });
});

watch(attachmentFiles, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentFiles: value });
});

watch(attachmentImages, (value, oldValue, onInvalidate) => {
  printOrderStore.updateUnit(unit.localUrl, { attachmentImages: value });
});

function duplicateUnit() {
  if (unit.file instanceof File) {
    printOrderStore.addDuplicate(<IPrintOrderUnit>{
      id: undefined,
      quantity: unit.quantity,
      spool: unit.spool,
      infill: unit.infill,
      infill_wall_combination: unit.infill_wall_combination,
      wall: unit.wall,
      wall_thickness: unit.wall_thickness,
      scale: unit.scale,
      scale_display: unit.scale,
      estimatedPrice: unit.estimated_price,
      file: unit.file,
      simplifiedFileUrl: unit.simplifiedFileUrl,
      comment: comment.value,
      localUrl: URL.createObjectURL(unit.file),
      attachmentFiles: [], // todo
      attachmentImages: [], // todo
      order: unit.order,
      model_dimensions: unit.model_dimensions,
      model_volume: unit.model_volume,
      model_rotation: unit.model_rotation,
      model_rotation_display: unit.model_rotation_display,
      optimal_rotation: unit.optimal_rotation,
      use_optimal_rotation: unit.use_optimal_rotation,
      screenshotURL: unit.screenshotURL,
      length_unit: unit.length_unit,
      rotation_unit: unit.rotation_unit,
      estimated_price: unit.estimated_price,
      estimated_time: unit.estimated_time,
      screenshot: unit.screenshot,
      printing_method: unit.printing_method,
    });
  } else {
    throw createError(
      `Cannot duplicate print order unit. Original unit.file is not of type File`
    );
  }
}

function removeUnit() {
  dialogStore.open("DialogConfirm", {
    title: capitalizeOnlyFirstLetter(t("are_you_sure")),
    subtitle: capitalizeOnlyFirstLetter(
      t("this_will_remove_print_unit_from_your_order")
    ),
    onConfirm: () => {
      printOrderStore.removeUnitByFileLocalUrl(unit.localUrl);
    },
    onDismiss: () => {},
  });
}

function onAttachmentFilesChange(e: any) {
  console.log("HERE");
  console.log(attachmentFiles.value);

  var files = Array.from<File>(e.target.files);
  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    // todo if file is image put is in attachmentImages

    attachmentFiles.value.push(<IAttachmentFile>{
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