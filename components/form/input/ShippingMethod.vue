<template>
  <div
    v-if="shipping_method && Object.keys(shipping_method).length"
    class="card compact px-2 bg-base-100 rounded-none border border-gray-400"
  >
    <div class="card-body">
      <div class="flex gap-2 justify-between items-center">
        <div class="flex flex-col gap-1">
          <strong>
            {{shipping_method.provider}}
          </strong>
          <div>
            {{shipping_method.description}}
          </div>
        </div>
        <div class="flex-1"></div>
        <div class="text-lg">
          €{{shipping_method.price}}
        </div>
        <div
          class="btn btn-ghost btn-circle btn-sm text-primary"
          @click="openDialog"
        >
          <Icon
            name="lucide:edit-2"
            size="18"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="btn btn-outline rounded-none flex gap-2 items-bottom italic font-bold text-gray-500"
    @click="openDialog"
  >
    <Icon
      class="text-info mb-0.5"
      name="lucide:plus-square"
      size="24"
    />
    Add shipping method
  </div>
</template>
    
    <script lang="ts" setup>
import { IShippingMethod } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let shipping_method = ref(context.node.value);

onMounted(() => {
  context.node.input(shipping_method.value || <IShippingMethod>{});
});

function openDialog() {
  dialogStore.open(context.node.props.dialogComponent, {
    shipping_method: shipping_method.value,
    enableUseDefault: true,
    onSaved: (obj: IShippingMethod) => {
      context.node.input(obj);
      shipping_method.value = obj;
    },
  });
}
</script>
    
    <style>
</style>