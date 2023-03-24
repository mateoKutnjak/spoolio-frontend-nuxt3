<template>
  <TransitionRoot
    appear
    :show="isDialogOpened"
    as="template"
  >
    <Dialog
      as="div"
      @close="closeOnClickOutside ? closeDialog() : () => null"
      class="relative z-10"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="`w-full max-w-${widthClass}`"
              class="transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <component
                :is="component"
                v-bind="componentProps"
              ></component>
              <!-- <slot></slot> -->
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const {
  isDialogOpened,
  componentName,
  componentProps,
  widthClass,
  closeOnClickOutside,
} = storeToRefs(dialogStore);

const component = ref();

watch(componentName, (value) => {
  component.value = resolveComponent(value);
});

function closeDialog() {
  dialogStore.close();
}
</script>

<style>
</style>