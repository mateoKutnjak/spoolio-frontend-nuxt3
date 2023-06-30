<template>
  <div
    class="bg-white btn btn-block btn-ghost btn-lg gap-6 rounded-md border border-stone-400/80 text-stone-500"
    @click="onEdit"
  >
    <div
      v-if="print_order?.payment_method && Object.keys(print_order.payment_method).length"
      class="w-full flex gap-6 font-normal items-center"
    >
      <Icon
        name="ph:money"
        size="30"
      />
      <div class="font-bold text-sm">{{print_order.payment_method}}</div>
      <div class="flex-1"></div>
      <Icon
        name="ph:note-pencil-bold"
        size="25"
      />
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-bold text-gray-500">
        <Icon
          name="ph:plus-square"
          size="20"
        />
        {{ capitalizeOnlyFirstLetter($t('choose') + ' ' + $t('payment_method')) }}
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const { t } = useI18n();

const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { print_order } = storeToRefs(printOrderStore);

onMounted(() => {
  print_order.value!.payment_method = "Credit card";
});

function onEdit() {
  notificationStore.show(
    capitalizeOnlyFirstLetter(t("no_other_payment_options_available")),
    ToastLevelType.info
  );
}
</script>
  
  <style>
</style>