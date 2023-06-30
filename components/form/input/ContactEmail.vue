<template>
  <div
    class="bg-white btn btn-block btn-ghost btn-lg no-animation gap-6 rounded-md border border-stone-400/80 text-stone-500"
    @click="openDialog"
  >
    <Icon
      name="ph:envelope-simple"
      size="30"
    />
    <div
      v-if="contact_email"
      class="py-5 font-bold text-sm"
    >
      {{contact_email}}
    </div>
    <div
      v-else
      class="py-5 text-sm font-bold mt-0.5"
    > {{ capitalizeOnlyFirstLetter($t('add') + " " + $t('contact_email'))  }}</div>
    <div class="flex-1"></div>
    <Icon
      v-if="contact_email"
      name="ph:note-pencil-bold"
      size="25"
    />
    <Icon
      v-else
      name="ph:caret-right-bold"
      size="22"
    />
  </div>
</template>
    
    <script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const { t } = useI18n();

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let contact_email = ref(context.node.value);

onMounted(() => {
  context.node.input(contact_email.value || "");
});

function openDialog() {
  dialogStore.open(
    context.node.props.dialogComponent,
    {
      contact_email: contact_email.value,
      enableUseDefault: true,
      onSaved: (obj: string) => {
        context.node.input(obj);
        contact_email.value = obj;
      },
    },
    (t("add") + " " + t("contact_email")).toUpperCase()
  );
}
</script>
    
    <style>
</style>