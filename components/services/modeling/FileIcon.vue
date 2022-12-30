<template>
  <!-- <div
    class="indicator"
    @mouseover="isMouseover=true"
    @mouseleave="isMouseover=false"
  >
    <div
      v-if="isMouseover"
      class="indicator-item indicator-top m-1.5 mt-2"
    > -->
  <div class="indicator">
    <div class="indicator-item indicator-top m-1.5 mt-2">
      <button
        class="btn btn-circle btn-error btn-sm"
        @click="onRemoveFile"
      >
        <Icon
          name="material-symbols:close"
          size="22"
        />
      </button>
    </div>
    <div
      class="btn btn-outline btn-ghost border-gray-400 h-32 hover:bg-gray-300 hover:border-gray-400"
      @click="onClickFile"
    >
      <div class="flex flex-col gap-2 items-center text-gray-500">
        <Icon
          :name="toIconName2()"
          size="45"
        />
        <div class="text-center font-normal line-clamp-3 break-words w-28">{{ attachmentFile?.file.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useModelingOrderStore } from "~~/stores/modeling_order";

const modelingOrderStore = useModelingOrderStore();

const { attachmentFiles } = storeToRefs(modelingOrderStore);

const { localUrl } = defineProps(["localUrl"]);

const attachmentFile = computed(() => {
  return attachmentFiles.value.find((el) => el.localUrl === localUrl);
});

// const isMouseover = ref(false);

function onClickFile() {
  console.log("onClickFile TODO");
}

function onRemoveFile() {
  modelingOrderStore.removeAttachmentFileByLocalUrl(localUrl);
}

function toIconName2() {
  return toIconNameSafe(attachmentFile.value?.file);
}
</script>

<style>
</style>