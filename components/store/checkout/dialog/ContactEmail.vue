<template>
  <div class="card-body gap-8 p-2 py-0">
    <InfoLabel message="Enter contact e-mail where you will receive order updates" />
    <FormKit
      type="form"
      id="profile-form"
      submit-label="Update"
      @submit="submitHandler"
      :actions="false"
      :incomplete-message="false"
    >
      <div class="flex gap-3 justify-between items-start">
        <FormKit
          type="text"
          name="Contact email"
          v-model="email"
          validation="required|email"
          validation-visibility="blur"
          :classes="{
            outer: 'w-full',
            input: 'w-full',
            wrapper: 'w-full'
          }"
        />
        <div
          v-if="user"
          class="btn btn-ghost link link-info text-sm"
          @click="onUseDefaultClicked"
        >Use default</div>
      </div>
      <div class="pt-2">
        <FormKit
          type="submit"
          label="Save"
          :classes="{
                  input: 'btn btn-primary btn-block text-base'
              }"
        />
      </div>

    </FormKit>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);
const { store_order } = storeToRefs(cartStore);

const email = ref("");

onMounted(() => {
  email.value =
    store_order.value?.contact_email || user.value?.profile?.email || "";
});

function onUseDefaultClicked() {
  if (user.value?.profile?.email) {
    email.value = user.value?.profile?.email;
  } else if (user.value?.email) {
    email.value = user.value.email;
  } else {
    notificationStore.show("Cannot do that", ToastLevel.error());
  }
}

function submitHandler() {
  if (!store_order.value) {
    throw createError("Print order for this id is undefined");
  }

  store_order.value.contact_email = email.value;
  dialogStore.close();
}
</script>
  
  <style>
</style>