<template>
  <div
    class="bg-white btn btn-block btn-ghost btn-lg no-animation gap-6 rounded-md border border-stone-400/80 text-stone-500"
    @click="openDialog"
  >
    <Icon
      name="ph:password"
      size="30"
    />
    <div
      v-if="contact_email"
      class="font-bold text-lg"
    >
      {{contact_email}}
    </div>
    <div
      v-else
      class="text-lg font-bold"
    > {{ capitalizeOnlyFirstLetter($t('change_password'))  }}</div>
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

function openDialog() {
  dialogStore.open(
    context.node.props.dialogComponent,
    {},
    t("change_password").toUpperCase()
  );
}
</script>
    
    <style>
</style>