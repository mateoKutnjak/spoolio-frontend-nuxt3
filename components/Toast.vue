<template>
  <div>
    <Transition>
      <div
        v-show="(notificationState?.isOpened || false)"
        class="toast toast-bottom toast-end px-12 py-8 z-50"
      >
        <div
          id="toast-success"
          class="flex gap-2 items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div
            class="justify-center items-center w-8 h-8 rounded-lg"
            :class="[notificationState?.type.styles]"
          >
            <Icon
              :name="icon()"
              size="27"
            />
            <span class="sr-only">Check icon</span>
          </div>
          <div class="text-sm font-normal">{{notificationState?.message || ''}}</div>
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
import { TOAST_DURATION_MEDIUM } from "~~/constants/constants";
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
      }, TOAST_DURATION_MEDIUM);
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