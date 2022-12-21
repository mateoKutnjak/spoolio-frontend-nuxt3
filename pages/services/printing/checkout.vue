<template>
  <div class="container p-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div class="flex flex-col gap-4">
        <div class="card shadow-md border">
          <div class="card-body">
            <div class="card-title">1. Email</div>
            TODO email form for guest, autofill for logged in user
          </div>
        </div>
        <div class="card shadow-md border">
          <div class="card-body">
            <div class="card-title">2. Address</div>
            TODO address form for guest, autofill for logged in user
          </div>
        </div>
        <div class="card shadow-md border">
          <div class="card-body">
            <div class="card-title">3. Shipping method</div>
            TODO Headless UI radio group
          </div>
        </div>
        <div class="card shadow-md border">
          <div class="card-body">
            <div class="card-title">4. Payment method</div>
            TODO Credit card (single radio group choice)
          </div>
        </div>
      </div>
      <div>
        <div class="card shadow-md border">
          <div class="card-body">
            <div class="flex flex-col gap-10">
              <div class="flex flex-col gap-4">
                <div class="card-title">Items: {{ units.length }}</div>
                <div class="flex gap-4 overflow-x-auto pb-1">
                  <div
                    v-for="unit in units"
                    :key="unit.localUrl"
                    class="btn btn-square btn-lg btn-outline rounded-none text-xs font-normal"
                  >Preview static image with x{number of items}</div>
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="card-title">Summary</div>
                <table class="table table-compact w-full">
                  <tbody class="">
                    <tr>
                      <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">Items total price</td>
                      <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">${{totalPrice}}</td>
                    </tr>
                    <tr>
                      <td class="pl-0 py-1 py-0 text-base text-start border-b-2 border-gray-500 bg-transparent">
                        <div class="flex gap-1"><strong>Subtotal</strong>(VAT excluded)</div>
                      </td>
                      <td class="py-1 pt-0 text-lg text-end border-b-2 border-gray-500 bg-transparent"> <strong>$1234</strong></td>
                    </tr>
                    <tr>
                      <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">Tax</td>
                      <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">$123</td>
                    </tr>
                    <tr>
                      <td class="pl-0 py-1 pt-0 text-base border-b-2 border-gray-500 text-start bg-transparent">Shipping fees</td>
                      <td class="py-1 pt-0 text-lg border-b-2 border-gray-500 text-end bg-transparent">$12</td>
                    </tr>
                    <tr>
                      <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
                        <div class="flex gap-1"><strong>TOTAL PRICE</strong>(VAT included)</div>
                      </td>
                      <td class="py-2 text-lg text-end border-transparent bg-transparent"> <strong>$1234</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex flex-col gap-4">
                <div class="form-control ">
                  <label class="label cursor-pointer gap-4 justify-start">
                    <input
                      type="checkbox"
                      checked="checked"
                      class="checkbox"
                    />
                    <span class="label-text">TODO (with formkit this checkbox and button bellow) I agree to Terms & Condition and the Privacy Policy</span>
                  </label>
                </div>
                <div class="btn btn-primary btn-block text-base">PAY NOW</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderStore } from "~~/stores/print_order";

const printOrderStore = usePrintOrderStore();

const { units } = storeToRefs(printOrderStore);

const totalPrice = ref<number>(
  units.value.reduce(
    (acc, item) => Number(acc) + Number(item.estimatedPrice * item.quantity),
    0
  )
);
</script>

<style>
</style>