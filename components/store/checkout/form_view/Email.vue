<template>
  <div
    class="btn btn-ghost border-gray-300 text-start text-base justify-start px-4 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div v-if="contactEmail">
      <h1 class="font-normal">{{contactEmail}}</h1>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-normal text-gray-500">
        <Icon
          name="material-symbols:add"
          size="20"
        />
        Add email
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();

const { user } = storeToRefs(authStore);
const { contactEmail } = storeToRefs(cartStore);

onMounted(() => {
  if (!contactEmail.value || !Object.keys(contactEmail.value)) {
    if (user.value?.profile?.email) {
      contactEmail.value = user.value.profile.email;
    }
  }
});

function openDialog() {
  dialogStore.open("StoreCheckoutFormDialogEmail", []);
}
</script>

<style>
</style>