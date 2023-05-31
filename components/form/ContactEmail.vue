<template>
  <div class="card-body gap-8 p-2 py-0">
    <FormKit
      type="form"
      id="profile-form"
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
        >{{ capitalizeOnlyFirstLetter($t('use_default')) }}</div>
      </div>
      <div class="pt-2">
        <FormKit
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :classes="{
            input: 'btn-block'
          }"
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

const {t} = useI18n();

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
    notificationStore.show(capitalizeOnlyFirstLetter(t('cannot_do_that')), ToastLevelType.error);
  }
}

function submitHandler() {
  onSaved(email_ref.value);
  dialogStore.close();
}
</script>
    
    <style>
</style>