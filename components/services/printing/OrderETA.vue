<template>
  <div v-if="eta === null">
    <Icon
      class="text-gray-500 -my-10"
      name="eos-icons:three-dots-loading"
      size="50"
    />
  </div>
  <div v-else-if="eta === undefined">
    <ButtonRetry @on-click="printOrderStore.estimatePrintJobsOnly()" />
  </div>
  <div
    v-else
    class="btn btn-ghost btn-sm text-lg"
    @click="onClick"
  >
    <Icon
      class="text-info"
      name="ph:question"
      size="20"
    />{{ reformatDateShort(eta) }}
  </div>
</template>

<script lang="ts" setup>
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { t } = useI18n();

const { eta } = defineProps<{
  eta: string | null | undefined;
}>();

function onClick() {
  notificationStore.show(
    capitalizeOnlyFirstLetter(
      t("eta_is_calculated_regarding_current_printer_job_queue")
    ) +
      ". " +
      capitalizeOnlyFirstLetter(t("depending_on_payment_time_eta_can_differ")),
    ToastLevelType.info
  );
}
</script>

<style>
</style>