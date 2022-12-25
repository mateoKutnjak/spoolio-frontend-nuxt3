<template>
  <div>
    <Transition>
      <div
        v-show="isOpened || false"
        class="toast toast-bottom toast-end px-12 py-8 z-50"
        :class="styles"
      >
        <div
          id="toast-success"
          class="flex gap-2 items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800"
          role="alert"
          :class="styles"
        >
          <div
            :class="styles"
            class="justify-center items-center w-8 h-8 rounded-lg"
          >
            <Icon
              :name="iconName"
              size="27"
            />
            <span class="sr-only">Check icon</span>
          </div>
          <div class="text-sm font-normal">{{message || ''}}</div>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            data-dismiss-target="#toast-success"
            aria-label="Close"
            @click="notificationStore.close()"
          >
            <Icon
              name="material-symbols:close"
              size="23"
            />
          </button>
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

const { isOpened, message, iconName, styles } = storeToRefs(notificationStore);

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