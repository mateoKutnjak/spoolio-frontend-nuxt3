<template>
  <div>
    <FormKit
      type="form"
      id="change-password-form"
      @submit="submitHandler"
      :submit-label="capitalizeOnlyFirstLetter($t('change_password'))"
      :submit-attrs="{
        inputClass: 'btn-block',
        wrapperClass: 'mt-4',
        ignore: false,
      }"
    >
      <!-- <FormKit
        type="text"
        name="Old password"
        :placeholder="capitalizeOnlyFirstLetter($t('old_password'))"
        v-model="old_password_ref"
        validation="required"
        validation-visibility="blur"
      /> -->
      <FormKit
        type="password"
        name="new_password1"
        :placeholder=" capitalizeOnlyFirstLetter($t('new_password'))"
        v-model="new_password_ref"
        validation="required"
        validation-visibility="blur"
      />
      <FormKit
        type="password"
        name="new_password2"
        :placeholder="capitalizeOnlyFirstLetter($t('confirm_new_password'))"
        v-model="new_password_confirm_ref"
        validation="required"
        validation-visibility="blur"
      />

    </FormKit>
  </div>
</template>
    
    <script lang="ts" setup>
import { FormKitNode } from "@formkit/core";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const { t } = useI18n();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

// const old_password_ref = ref("");
const new_password_ref = ref("");
const new_password_confirm_ref = ref("");

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  authStore
    .changePassword("", new_password_ref.value, new_password_confirm_ref.value)
    .then(() => {
      notificationStore.show(
        capitalizeOnlyFirstLetter(t("saved")),
        ToastLevelType.success
      );
      dialogStore.close();
    })
    .catch((err) => {
      notificationStore.showFetchError(err);
      node?.setErrors(err?.data);
    });
}
</script>
    
    <style>
</style>