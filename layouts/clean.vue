<template>
  <div :style="`background-color: ${BACKGROUND_COLOR};`">
    <Toast />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { BACKGROUND_COLOR } from "~~/constants/constants";

function beforeWindowUnload(e: any) {
  console.log(e);

  if (!window.confirm("Do you want to leave? Your progress won't be saved.")) {
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = "";
  }
}

onMounted(() => {
  console.debug("onMounted: adding listeners (beforeunload, )");
  window.addEventListener("beforeunload", beforeWindowUnload);
});

onBeforeUnmount(() => {
  console.debug("onBeforeUnmount: removing listeners (beforeunload, )");
  window.removeEventListener("beforeunload", beforeWindowUnload);
});
</script>

<style>
</style>