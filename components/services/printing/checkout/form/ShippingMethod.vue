<template>
  <div class="card-body gap-6 py-6 pt-4">
    <div class="card-title">
      Shipping method
    </div>
    <div>
      <RadioGroup v-model="selected">
        <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
        <div class="space-y-2">
          <RadioGroupOption
            as="template"
            v-for="shippingMethod in shippingMethods"
            :key="shippingMethod.provider"
            :value="shippingMethod"
            v-slot="{ checked }"
          >
            <div
              :class="[
                checked ? 'bg-sky-900 bg-opacity-75 text-white ' : 'bg-white ',
              ]"
              class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
            >
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <RadioGroupLabel
                      as="p"
                      :class="checked ? 'text-white' : 'text-gray-900'"
                      class="font-medium"
                    >
                      {{ shippingMethod.provider }}
                    </RadioGroupLabel>
                    <RadioGroupDescription
                      as="span"
                      :class="checked ? 'text-sky-100' : 'text-gray-500'"
                      class="inline"
                    >
                      <span> {{ shippingMethod.description }}</span>
                      <span aria-hidden="true"> &middot; </span>
                      <span>{{ shippingMethod.price }}</span>
                    </RadioGroupDescription>
                  </div>
                </div>
                <div
                  v-show="checked"
                  class="shrink-0 text-white"
                >
                  <svg
                    class="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="12"
                      fill="#fff"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M7 13l3 3 7-7"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
    <div
      class="btn btn-block btn-primary text-lg"
      @click="onSubmit"
    >Save</div>
  </div>
</template>

<script lang="ts" setup>
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useShippingMethodStore } from "~~/stores/shipping_method";

const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();
const shippingMethodStore = useShippingMethodStore();

const { shippingMethod } = storeToRefs(printOrderStore);
const { shippingMethods } = storeToRefs(shippingMethodStore);

const selected = ref(shippingMethod.value || shippingMethods.value[0]); // todo check index error

function onSubmit() {
  shippingMethod.value = selected.value;
  dialogStore.close();
}
</script>

<style>
</style>