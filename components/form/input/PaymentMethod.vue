<template>
  <div class="card compact px-2 bg-base-100 rounded-none border border-gray-400">
    <div
      class="card-body"
      v-if="print_order?.payment_method && Object.keys(print_order.payment_method).length"
    >
      <div class="flex gap-3 font-normal items-center">
        <Icon
          name="noto-v1:credit-card"
          size="26"
        />
        <div>{{print_order.payment_method}}</div>
        <div class="flex-1"></div>
        <div
          class="btn btn-ghost btn-circle btn-sm text-primary"
          @click="onEdit"
        >
          <Icon
            name="ph:note-pencil"
            size="22"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-bold text-gray-500">
        <Icon
          name="ph:plus-square"
          size="20"
        />
        {{ capitalizeOnlyFirstLetter($t('add_payment_method')) }}
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