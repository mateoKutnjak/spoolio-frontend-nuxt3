<template>
  <div class="px-10 py-6 flex flex-col gap-2 sm:rounded-lg rounded-none border border-stone-300 shadow-md bg-white">
    <div class="flex sm:flex-row flex-col justify-between text-xl">
      <div class="w-full flex flex-col">
        <div class="flex justify-between items-center text-stone-400">
          MODEL {{ index+1 }}/{{ totalUnitCount }}
          <div class="flex gap-1">
            <div
              class="btn btn-md btn-circle btn-ghost text-gray-400"
              @click.stop="duplicateUnit"
            >
              <Icon
                name="ph:copy"
                size="24"
              />
            </div>
            <div
              class="btn btn-md btn-circle btn-ghost text-error"
              @click.stop="removeUnit"
            >
              <Icon
                name="ph:trash"
                size="24"
              />
            </div>
          </div>
        </div>

        <span class="text-stone-600 font-bold break-all text-2xl">{{ extractUrlFileStringUnion(unit.file) }}</span>
        <ServicesPrintingDimensionInfo :unit="unit" />
      </div>
    </div>

    <div class="card sm:card-side gap-8">
      <div class="h-min flex flex-col gap-4 items-center">
        <nuxt-img
          class="md:h-44 aspect-square border border-stone-400 rounded-md"
          :src="unit.screenshotURL"
        >
        </nuxt-img>
        <IncreaseDecreaseQuantity
          :max="MAX_PRINT_QUANTITY"
          :min="1"
          :initial-value="unit.quantity"
          :emit-live="false"
          @on-decrease-value="decreaseQuantity"
          @on-increase-value="increaseQuantity"
          @on-value-set="(q) => setQuantity(q) "
        />
      </div>

      <div class="w-full h-min grid md:grid-cols-3 grid-cols-2 gap-3 text-stone-500 items-end">
        <div>
          <div class="text-base">{{ $t('method') }}</div>
          <div class="text-2xl font-bold">{{ unit.printing_method.name.toUpperCase() }}</div>
        </div>
        <div>
          <div class="text-base">{{ $t('infill') }}</div>
          <div class="text-2xl font-bold">
            <Icon
              class="mb-0.5 mr-2 "
              name="ph:hash-bold"
              size="25"
            />{{ unit.infill.percentage * 100 }}%
          </div>
        </div>
        <div>
          <div class="text-base  line-clamp-1">{{ $t('price_per_piece') }}</div>
          <ServicesPrintingUnitSinglePrice
            class="text-2xl"
            :unit="unit"
            :price="totalPrice / unit.quantity"
          />
        </div>

        <div>
          <div class="text-base ">{{ $t('material') }}</div>
          <div class="text-2xl font-bold">{{ unit.spool.material.name }}</div>
        </div>
        <div>
          <div class=" line-clamp-1 text-base">{{ $t('layer_height') }}</div>
          <div class="text-2xl font-bold">
            <Icon
              class="mb-0.5 mr-2 text-stone-400"
              name="ph:stack-bold"
              size="25"
            />{{ unit.wall_thickness.thickness }}mm
          </div>
        </div>
        <div>
          <div class="text-base line-clamp-1">{{ $t('total_price') }}</div>
          <ServicesPrintingUnitSinglePrice
            class="text-2xl"
            :unit="unit"
            :price="totalPrice"
          />
        </div>

        <div>
          <div class="text-base ">{{ $t('color') }}</div>
          <div class="text-2xl font-bold">{{ $t(unit.spool.color.name).toUpperCase() }}</div>
        </div>
        <div>
          <div class="text-base  line-clamp-1">{{ $t('outer_layers') }}</div>
          <div class="text-2xl font-bold">
            <Icon
              class="mb-0.5 mr-2 text-stone-400"
              name="ph:list-bold"
              size="25"
            />{{ unit.wall.amount }}
          </div>
        </div>
        <NuxtLink :to="localePath(`/services/printing/units/${urlExtractFilename(unit.localUrl)}`)">
          <div class="mt-4 btn btn-primary btn-sm btn-block text-white rounded-md">
            {{ capitalizeOnlyFirstLetter($t('settings')).toUpperCase() }}
          </div>
        </NuxtLink>
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

const { unit, index } = defineProps<{
  unit: IPrintOrderUnit;
  index: number;
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

const totalUnitCount = computed(() => printOrderStore.getUnits.length);

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
  // printOrderStore.updateUnit(unit.localUrl, { quantity: unit.quantity + 1 });
}

function decreaseQuantity() {
  // if (unit.quantity > 1) {
  //   printOrderStore.updateUnit(unit.localUrl, { quantity: unit.quantity - 1 });
  // } else {
  //   printOrderStore.updateUnit(unit.localUrl, { quantity: 1 });
  // }
}

function setQuantity(q: number) {
  printOrderStore.updateUnit(unit.localUrl, { quantity: q });
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