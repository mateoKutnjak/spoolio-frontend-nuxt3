<template>
  <div class="avatar">
    <div class="shadow w-12 h-12 rounded-full bg-white">
      <Icon
        class="w-12 h-12 p-2 text-gray-500"
        name="ph:user-duotone"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const { userData } = defineProps(["userData"]);

const hasAnyName = computed(() => {
  return userData?.profile?.first_name || userData?.profile?.last_name;
});
</script>

<style>
</style>