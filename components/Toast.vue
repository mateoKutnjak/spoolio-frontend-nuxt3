<template>
  <div>
    <Transition>
      <div
        v-show="isOpened"
        class="toast toast-bottom toast-end px-12 py-8 z-50 text-base text-white"
      >
        <div
          v-if="type === ToastLevelType.error"
          class="flex gap-2 items-stretch py-1.5 px-2.5 w-full max-w-md rounded shadow-lg bg-error text-white"
          role="alert"
        >
          <div class="flex gap-3 justify-between items-center px-2 py-2">
            <div class="justify-center items-center rounded-lg">
              <Icon
                name="material-symbols:error"
                size="28"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div class="font-normal">{{message || ''}}</div>
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              data-dismiss-target="#toast-success"
              aria-label="Close"
              @click="onCloseClicked"
            >
              <Icon
                name="material-symbols:close"
                size="23"
              />
            </button>
          </div>
        </div>
        <div
          v-else-if="type === ToastLevelType.success"
          class="flex gap-2 items-stretch py-1.5 px-2.5 w-full max-w-md rounded shadow-lg bg-success text-white"
          role="alert"
        >
          <div class="flex gap-3 justify-between items-center px-2 py-2">
            <div class="justify-center items-center rounded-lg">
              <Icon
                name="material-symbols:check-circle-rounded"
                size="28"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div class="font-normal">{{message || ''}}</div>
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              data-dismiss-target="#toast-success"
              aria-label="Close"
              @click="onCloseClicked"
            >
              <Icon
                name="material-symbols:close"
                size="23"
              />
            </button>
          </div>
        </div>
        <div
          v-if="type === ToastLevelType.info"
          class="flex gap-2 items-stretch py-1.5 px-2.5 w-full max-w-md rounded shadow-lg bg-info text-white"
          role="alert"
        >
          <div class="flex gap-3 justify-between items-center px-2 py-2">
            <div class="justify-center items-center rounded-lg">
              <Icon
                name="material-symbols:info-rounded"
                size="28"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div class="font-normal">{{message || ''}}</div>
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              data-dismiss-target="#toast-success"
              aria-label="Close"
              @click="onCloseClicked"
            >
              <Icon
                name="material-symbols:close"
                size="23"
              />
            </button>
          </div>
        </div>
        <div
          v-if="type === ToastLevelType.debug"
          class="flex gap-2 items-stretch py-1.5 px-2.5 w-full max-w-md rounded shadow-lg bg-warning text-white"
          role="alert"
        >
          <div class="flex gap-3 justify-between items-center px-2 py-2">
            <div class="justify-center items-center rounded-lg">
              <Icon
                name="material-symbols:warning"
                size="28"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div class="font-normal">{{message || ''}}</div>
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              data-dismiss-target="#toast-success"
              aria-label="Close"
              @click="onCloseClicked"
            >
              <Icon
                name="material-symbols:close"
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