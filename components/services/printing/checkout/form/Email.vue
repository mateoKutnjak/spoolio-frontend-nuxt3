<template>
  <div class="card-body gap-8 p-2 py-0">
    <div class="text-base flex gap-3 justify-between">
      <Icon
        name="material-symbols:info-rounded"
        class="text-info"
        size="30"
      />
      <div class="italic text-md">Enter contact e-mail where you will receive order updates</div>
    </div>
    <FormKit
      type="form"
      id="profile-form"
      submit-label="Update"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex gap-3 justify-between items-start">
        <FormKit
          type="email"
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
          class="btn btn-ghost link link-info text-base"
          @click="onUseDefaultClicked"
        >Use default</div>
      </div>
      <div class="pt-2">
        <FormKit
          type="submit"
          label="Save"
          :classes="{
                  input: 'btn btn-primary btn-block'
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
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { contactEmail } = storeToRefs(printOrderStore);

const email = ref("");

onMounted(() => {
  email.value = contactEmail.value || user.value?.profile?.email || "";
});

function onUseDefaultClicked() {
  if (!user.value?.profile?.email) {
    notificationStore.show("Cannot do that", ToastLevel.error());
    return;
  }

  email.value = user.value?.profile?.email ?? "";
}

function submitHandler() {
  contactEmail.value = email.value;
  dialogStore.close();
}
</script>
  
  <style>
</style>