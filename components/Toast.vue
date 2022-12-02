<template>
  <div>
    <Transition>
      <div
        v-show="(notificationState?.isOpened || false)"
        class="toast toast-bottom toast-end px-12 py-8"
      >
        <div
          id="toast-success"
          class="flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div
            class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg"
            :class="[notificationState?.type.styles]"
          >
            <Icon
              :name="icon()"
              size="27"
            />
            <span class="sr-only">Check icon</span>
          </div>
          <div class="ml-3 text-sm font-normal">{{notificationState?.message || ''}}</div>
          <button
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-success"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useNotificationStore } from "~~/stores/notification";

const notificationStore = useNotificationStore();

const notificationState = ref();

onMounted(() => {
  notificationState.value = notificationStore.getState;
});

watch(notificationStore.getState, (value, oldValue, onInvalidate) => {
  console.log("new notification state");
  console.log(notificationStore.getState.isOpened);
  console.log(notificationState.value);

  notificationState.value = notificationStore.getState;

  if (value) {
    // * Turn off toast visibility after some time
    new Promise((resolve, reject) => {
      setTimeout(() => {
        notificationStore.close();
        resolve(5000);
      }, 5000);
    });
  }
});

function icon() {
  switch (notificationState?.value?.type?.type || ToastLevelType.debug) {
    case ToastLevelType.debug:
      return "carbon:debug";
    case ToastLevelType.info:
      return "mdi:information-variant";
    case ToastLevelType.error:
      return "material-symbols:error";
    case ToastLevelType.success:
      return "material-symbols:check-small-rounded";
    default:
      return "material-symbols:question-mark-rounded";
  }
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