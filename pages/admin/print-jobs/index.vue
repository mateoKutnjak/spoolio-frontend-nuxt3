<template>
  <div
    v-for="(printer, index) in printerStore.getPrinters"
    :key="printer.id"
    :class="index == printerStore.getPrinters.length - 1 ? '' : 'mb-6'"
  >
    <div class="w-full p-6 flex gap-4 items-center text-stone-600">
      <Icon
        name="lucide:printer"
        size="50"
      />
      <div class="flex flex-col">
        <div class="text-lg font-bold">{{ printer.name }}</div>
        <div>{{ printer.type.name }}</div>
      </div>
      <div class="flex-1 flex gap-2 justify-center">
        <div
          v-for="supported_material in printer.type.supported_materials"
          :key="supported_material.id"
        >
          <AttributeItem :title="supported_material.name" />
        </div>
      </div>
      <div
        v-if="!printer.available"
        class="flex gap-2 items-center"
      >
        Not available
        <Icon
          class="text-error"
          name="lucide:x-circle"
          size="30"
        />
      </div>
      <div
        v-else
        class="flex gap-2 items-center"
      >
        Available
        <Icon
          class="text-success"
          name="lucide:check-circle"
          size="30"
        />
      </div>
    </div>
    <div class="overflow-x-visible">
      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <td>Order Id</td>
            <td>File</td>
            <th>Interval</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="printJob in printingJobStore.getByPrinterId(printer.id)"
            :key="printJob.id"
          >
            <th>{{ printJob.id }}</th>
            <td>{{ reformatDate(printJob.start_at) }}</td>
            <td>{{ printJob.print_order_unit.order }}</td>
            <td>
              <a
                class="link link-info"
                :href="extractUrlFileStringUnion(printJob.print_order_unit.file)"
              >
                {{ urlExtractFilename(printJob.print_order_unit.file.toString()) }}
              </a>
            </td>
            <td class="font-bold">{{ reformatTime(printJob.start_at) }} - {{ reformatTime(printJob.end_at) }}</td>
            <td>
              <OrderStatusView :raw-status="printJob.status" />
            </td>
            <td class="relative">
              <DropdownChoice
                menu-button-icon="lucide:more-vertical"
                :choices="OrderStatus.printingJobStatuses.map(el => el.display_name)"
                :preselected="OrderStatus.all[printJob.status].display_name"
                @on-item-chosen="item => onStatusChosen(item, printJob)"
              ></DropdownChoice>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePrintingJobStore } from "~~/stores/print_job";
import { usePrinterStore } from "~~/stores/printer";
import { OrderStatus, PAGE_SIZE } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { useDialogStore } from "~~/stores/dialog";
import { IPrintingJob } from "~~/constants/data";

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const printerStore = usePrinterStore();
const printingJobStore = usePrintingJobStore();

var limit = 10;
var offset = 0;

printerStore
  .fetchPaginated(limit, offset)
  .then((res) => {
    res.results.forEach((el) => {
      printingJobStore.fetchAllByPrinterId(el.id, true);
    });
  })
  .catch((err) => notificationStore.showFetchError(err));

function onStatusChosen(statusName: string, printJob: IPrintingJob) {
  console.log(statusName);

  dialogStore.open("DialogConfirm", {
    title: `Are you sure about that?`,
    subtitle: `You will change printing job #${printJob.id} status from ${
      OrderStatus.all[printJob.status].display_name
    } to ${statusName}?`,
    onConfirm: () => {
      const oldStatus = OrderStatus.all[printJob.status];
      let newStatus = null;

      for (let key in OrderStatus.all) {
        if (OrderStatus.all[key].display_name === statusName) {
          newStatus = OrderStatus.all[key];
        }
      }

      if (!newStatus) {
        notificationStore.show(
          `Cannot update print order job. No OrderStatus with display_name ${statusName}`
        );
        return;
      }

      if (OrderStatus.isValidTransitionPrintJobStatus(oldStatus, newStatus)) {
        printingJobStore.updateStatus(printJob.id, newStatus.server_name);
      } else {
        notificationStore.show(
          `Cannot update print order job. Transition ${oldStatus.display_name} => ${newStatus.display_name} now allowed. Do this through backend admin site.`
        );
      }
    },
    onDismiss: () => {},
  });
}
</script>

<style>
</style>