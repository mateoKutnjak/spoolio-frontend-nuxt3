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
          v-model="email_ref"
          validation="required|email"
          validation-visibility="blur"
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
        />
      </div>

    </FormKit>
  </div>
</template>
    
    <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const { contact_email, enableUseDefault, onSaved } = defineProps<{
  contact_email: string;
  enableUseDefault: boolean;
  onSaved: Function;
}>();

const email_ref = ref(contact_email);

function onUseDefaultClicked() {
  if (user.value?.profile?.email) {
    email_ref.value = user.value?.profile?.email;
  } else if (user.value?.email) {
    email_ref.value = user.value.email;
  } else {
    notificationStore.show("Cannot do that", ToastLevelType.error);
  }
}

function submitHandler() {
  onSaved(email_ref.value);
  dialogStore.close();
}
</script>
    
    <style>
</style>