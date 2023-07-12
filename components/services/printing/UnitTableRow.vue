<template>
  <tr class="cursor-pointer hover:bg-stone-100/70">
    <td class="px-6 pr-16 py-6 w-36">
      <div class="w-36 flex flex-col gap-4">
        <div class="w-36 h-36">
          <nuxt-img
            class="w-36 h-36 p-0 m-0 border border-gray-400"
            :src="unit.screenshotURL"
          >
          </nuxt-img>
        </div>
        <div class="w-36 flex gap-4 justify-between items-center text-gray-500 text-sm">
          {{ capitalizeOnlyFirstLetter($t('quantity')) }}:
          <LimitedNumberInput
            :key="unit.quantity"
            class="w-full"
            :max="MAX_PRINT_QUANTITY"
            :min="1"
            :initial-value="unit.quantity"
            @on-value-set="(q) => printOrderStore.updateUnit(unit.localUrl, { quantity: q })"
            @click.stop
          />
        </div>
      </div>
    </td>
    <td class="py-4">
      <div class="h-48 max-w-xs flex flex-col justify-between">
        <div class="text-lg font-semibold text-gray-700 dark:text-white line-clamp-1">
          {{ extractUrlFileStringUnion(unit.file) }}
        </div>
        <!-- <RadioGroupDimensionUnit
          :unit="unit"
          :key="unit.length_unit"
        /> -->
        <div class="flex flex-col gap-1.5">
          <ServicesPrintingDimensionInfo
            :unit="unit"
          />
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
      </div>
    </td>
    <td class="py-4">
      <div class="flex gap-2 items-center justify-center">
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
    </td>
    <td class="py-4 px-4 text-end">
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
    </td>
    <td class="py-4 text-center">
      <div
        class="btn btn-md btn-circle btn-ghost text-gray-400"
        @click.stop.prevent="duplicateUnit"
      >
        <Icon
          name="lucide:copy"
          size="24"
        />
      </div>
      <div
        class="btn btn-md btn-circle btn-ghost text-error"
        @click.stop.prevent="removeUnit"
      >
        <Icon
          name="lucide:trash-2"
          size="24"
        />
      </div>
      <NuxtLink :to="localePath(`/services/printing/units/${urlExtractFilename(unit.localUrl)}`)">
        <div class="btn">todo postavke</div>
      </NuxtLink>
    </td>
  </tr>
</template>
  
  <script lang="ts" setup>
import { MAX_PRINT_QUANTITY } from "~~/constants/constants";
import {
  IAttachmentFile,
  IAttachmentImage,
  IPrintOrderUnit,
} from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const { t } = useI18n();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const dialogStore = useDialogStore();
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
      estimated_price: unit.estimated_price,
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
</script>
  
  <style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>