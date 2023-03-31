<template>
  <div>
    <Transition>
      <div
        v-show="isOpened"
        class="toast toast-bottom toast-end px-12 py-8 z-50 text-base"
      >

        <div
          class="py-4 px-5 w-full max-w-md rounded shadow-lg text-white font-bold"
          :class="toastBgColor"
          role="alert"
        >
          <div class="flex gap-5 justify-between items-center">
            <div class="justify-center items-center rounded-lg">
              <Icon
                :name="toastIconName"
                size="25"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div>{{message || ''}}</div>
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              data-dismiss-target="#toast-success"
              aria-label="Close"
              @click="onCloseClicked"
            >
              <Icon
                name="lucide:x"
                size="23"
              />
            </button>
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
      return "bg-gray-700";
  }
});

const toastIconName = computed(() => {
  switch (type.value) {
    case ToastLevelType.debug:
      return "lucide:alert-triangle";
    case ToastLevelType.error:
      return "lucide:alert-circle";
    case ToastLevelType.success:
      return "lucide:check-circle";
    case ToastLevelType.info:
      return "lucide:info";
    default:
      return "bg-gray-700";
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