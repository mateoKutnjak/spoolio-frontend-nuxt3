<template>
  <div
    v-if="contact_email"
    class="card compact px-2 bg-base-100 rounded-none border border-gray-400"
  >
    <div class="card-body">
      <div class="card-title text-base text-gray-700 font-normal justify-start items-center">
        <div class="font-normal">{{contact_email}}</div>
        <div class="flex-1"></div>
        <div
          class="btn btn-ghost btn-circle btn-sm text-primary"
          @click="openDialog"
        >
          <Icon
            name="lucide:edit-2"
            size="18"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="btn btn-outline rounded-none flex gap-2 items-bottom italic font-bold text-gray-500"
    @click="openDialog"
  >
    <Icon
      class="text-info mb-0.5"
      name="lucide:plus-square"
      size="18"
    />
    {{ capitalizeOnlyFirstLetter($t('add_contact_email')) }}
  </div>

</template>
    
    <script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let contact_email = ref(context.node.value);

onMounted(() => {
  context.node.input(contact_email.value || "");
});

function openDialog() {
  dialogStore.open(context.node.props.dialogComponent, {
    contact_email: contact_email.value,
    enableUseDefault: true,
    onSaved: (obj: string) => {
      context.node.input(obj);
      contact_email.value = obj;
    },
  });
}
</script>
    
    <style>
</style>