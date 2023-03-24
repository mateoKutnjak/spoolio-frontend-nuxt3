<template>
  <div
    class="w-full btn btn-ghost border-gray-300 text-start text-base justify-start px-4 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div v-if="store_order?.contact_email">
      <h1 class="font-normal">{{store_order.contact_email}}</h1>
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

const { context } = defineProps(["context"]);

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();

const { user } = storeToRefs(authStore);
const { store_order } = storeToRefs(cartStore);

onMounted(() => {
  if (!store_order.value) {
    throw createError("Printing order undefined");
  }

  if (
    !store_order.value.contact_email ||
    !Object.keys(store_order.value.contact_email)
  ) {
    if (user.value?.profile?.email) {
      console.error("TODO check if email updates (see linr below)");
      store_order.value!.contact_email = user.value.profile.email;
    }
  }

  context.node.input(store_order.value?.contact_email || "");
});

watch(
  store_order,
  (value) => {
    context.node.input(value.contact_email);
  },
  { deep: true }
);

function openDialog() {
  dialogStore.open("StoreCheckoutDialogContactEmail", {});
}
</script>
  
  <style>
</style>