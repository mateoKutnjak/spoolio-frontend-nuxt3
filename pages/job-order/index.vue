<template>
  <div class="flex justify-center">
    <ul class="steps steps-vertical sm:steps-horizontal">
      <li class="step step-success">Import files (TODO)</li>
      <li class="step">Choose plan</li>
      <li class="step step-success">Confirm your info</li>
      <li class="step">Order</li>
    </ul>
  </div>
  <div>
    <div class="alert alert-warning shadow-lg">
      <div>
        <Icon
          name="material-symbols:warning-outline-rounded"
          size="27"
          aria-hidden="true"
        />
        <span>Your profile information is incomplete</span>
      </div>
    </div>
    <PrintingJobOrderForm />

  </div>
</template>
  
  <script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const getUser = computed(() => {
  return authStore.getUser;
});

watch(getUser, () => {});
</script>
  
  <style>
</style>