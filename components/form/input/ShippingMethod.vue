<template>
  <div
    class="bg-white h-full btn btn-block btn-ghost btn-lg no-animation gap-6 rounded-md border border-stone-400/80 text-stone-500"
    @click="openDialog"
  >
    <Icon
      name="ph:truck"
      size="30"
    />
    <div
      v-if="shipping_method && Object.keys(shipping_method).length"
      class="py-5 flex flex-col items-start"
    >
      <div class="flex gap-2 font-bold text-sm">
        <div>
          {{shipping_method.provider}}
        </div>
        •
        <div>
          €{{shipping_method.price}}
        </div>
      </div>
      <div class="text-sm">
        {{ capitalizeOnlyFirstLetter($t(shipping_method.description)) }}
      </div>
    </div>
    <div
      v-else
      class="py-5 text-sm font-bold mt-0.5"
    >
      {{ capitalizeOnlyFirstLetter($t('add') + " " + $t('shipping_method'))  }}
    </div>
    <div class="flex-1"></div>
    <Icon
      v-if="shipping_method && Object.keys(shipping_method).length"
      name="ph:note-pencil-bold"
      size="25"
    />
    <Icon
      v-else
      name="ph:caret-right-bold"
      size="22"
    />
  </div>
</template>
    
    <script lang="ts" setup>
import { IShippingMethod } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const { t } = useI18n();

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let shipping_method = ref(context.node.value);

onMounted(() => {
  context.node.input(shipping_method.value || <IShippingMethod>{});
});

function openDialog() {
  dialogStore.open(
    context.node.props.dialogComponent,
    {
      shipping_method: shipping_method.value,
      enableUseDefault: true,
      onSaved: (obj: IShippingMethod) => {
        context.node.input(obj);
        shipping_method.value = obj;
      },
    },
    (t("choose") + " " + t("shipping_method")).toUpperCase()
  );
}
</script>
    
    <style>
</style>