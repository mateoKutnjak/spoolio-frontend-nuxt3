<template>
  <div>
    <Transition>
      <div
        v-show="isOpened || false"
        class="toast toast-bottom toast-end px-12 py-8 z-50"
      >
        <div
          id="toast-success"
          class="flex gap-2 items-stretch p-4 w-full max-w-xs rounded-lg shadow-lg bg-white"
          role="alert"
        >
          <div
            class="w-1.5 rounded"
            :class="backgroundColor"
          />
          <div class="flex gap-3 justify-between items-center px-2 py-2">
            <div
              class="justify-center items-center rounded-lg"
              :class="iconColor"
            >
              <Icon
                :name="iconName"
                size="28"
              />
              <span class="sr-only">Check icon</span>
            </div>
            <div class="text-sm font-normal">{{message || ''}}</div>
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

const { isOpened, message, iconName, iconColor, backgroundColor } =
  storeToRefs(notificationStore);

watch(isOpened, (value) => {
  if (value) {
    // * Turn off toast visibility after some time
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