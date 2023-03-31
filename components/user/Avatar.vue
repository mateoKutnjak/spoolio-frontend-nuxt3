<template>
  <div class="avatar">
    <div class="shadow w-12 h-12 rounded-full bg-base-100/80">
      <Icon
        class="w-12 h-12 p-2 text-gray-500"
        name="lucide:user"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { userData } = defineProps(["userData"]);

const hasAnyName = computed(() => {
  return userData?.profile?.first_name || userData?.profile?.last_name;
});
</script>

<style>
</style>