<template>
  <div class="flex gap-3">
    <FormKit
      type="email"
      name="general_email"
      label="Contact email"
      v-model="contactEmail"
      validation="email"
      validation-visibility="live"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const contactEmail = ref(user.value?.profile?.email || "");
</script>

<style>
</style>