<template>
  <div class="flex gap-3">
    <input
      v-model="email"
      type="text"
      placeholder="Type here"
      class="input input-bordered w-full"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const email = ref(user.value?.email || "");
</script>

<style>
</style>