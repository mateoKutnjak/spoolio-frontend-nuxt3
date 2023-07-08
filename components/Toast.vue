<template>
  <div>
    <Transition>
      <div
        v-show="isOpened"
        class="toast toast-bottom toast-end px-12 py-8 z-50  whitespace-normal"
      >
        <div
          class="max-w-lg rounded-md shadow-xl font-bold text-white"
          :class="`${toastBgColor}`"
        >
          <div class="flex">
            <div :class="`px-5 py-4 flex gap-5 items-center `">
              <div class="justify-center items-center rounded-lg">
                <Icon
                  :name="toastIconName"
                  size="30"
                />
                <span class="sr-only">Check icon</span>
              </div>
              <div class="flex flex-col">
                <!-- <div class="text-base font-bold">{{ capitalizeOnlyFirstLetter(toastTitle) }}</div> -->
                <div class="break-words text-lg font-semibold">{{message || ''}}</div>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-square text-white"
                data-dismiss-target="#toast-success"
                aria-label="Close"
                @click="onCloseClicked"
              >
                <Icon
                  name="ph:x"
                  size="30"
                />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { TOAST_DURATION_MEDIUM } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";

const notificationStore = useNotificationStore();

const { isOpened, message, type } = storeToRefs(notificationStore);

const toastBgColor = computed(() => {
  switch (type.value) {
    case ToastLevelType.debug:
      return "bg-warning";
    case ToastLevelType.error:
      return "bg-error";
    case ToastLevelType.success:
      return "bg-success";
    case ToastLevelType.info:
      return "bg-info";
    default:
      return "bg-stone-600";
  }
});

const textColor = computed(() => {
  switch (type.value) {
    case ToastLevelType.debug:
      return "text-warning";
    case ToastLevelType.error:
      return "text-error";
    case ToastLevelType.success:
      return "text-success";
    case ToastLevelType.info:
      return "text-info";
    default:
      return "text-stone-600";
  }
});

const toastIconName = computed(() => {
  switch (type.value) {
    case ToastLevelType.debug:
      return "ph:warning-fill";
    case ToastLevelType.error:
      return "ph:warning-circle-fill";
    case ToastLevelType.success:
      return "ph:check-circle-fill";
    case ToastLevelType.info:
      return "ph:info-fill";
    default:
      return "bg-gray-700";
  }
});

const toastTitle = computed(() => {
  switch (type.value) {
    case ToastLevelType.debug:
      return "debug";
    case ToastLevelType.error:
      return "error";
    case ToastLevelType.success:
      return "success";
    case ToastLevelType.info:
      return "info";
    default:
      return "message";
  }
});

watch(isOpened, (value) => {
  if (value) {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        notificationStore.close();
        resolve(5000);
      }, TOAST_DURATION_MEDIUM);
    });
  }
});

function onCloseClicked() {
  notificationStore.close();
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>