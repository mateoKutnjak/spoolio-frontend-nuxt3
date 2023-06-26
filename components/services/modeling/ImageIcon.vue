<template>
  <div class="indicator">
    <div class="indicator-item indicator-top m-1.5 mt-2">
      <button
        class="btn btn-circle btn-error btn-sm"
        @click="onRemoveFile"
      >
        <Icon
          name="ph:x-bold"
          size="18"
        />
      </button>
    </div>
    <div
      class="btn btn-outline btn-ghost border-gray-300 h-32 hover:bg-gray-200 hover:border-gray-300 bg-gray-50 shadow"
      @click="onClickFile"
    >
      <div class="flex flex-col gap-2 items-center text-gray-500">
        <Icon
          :name="toIconName2()"
          size="45"
        />
        <div class="text-center font-normal line-clamp-3 break-words w-28">{{ attachmentImage?.image.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useModelingOrderStore } from "~~/stores/modeling_order";

const modelingOrderStore = useModelingOrderStore();

const { attachmentImages } = storeToRefs(modelingOrderStore);

const { localUrl } = defineProps(["localUrl"]);

const attachmentImage = computed(() => {
  return attachmentImages.value.find((el) => el.localUrl === localUrl);
});

// const isMouseover = ref(false);

function onClickFile() {
  console.log("onClickFile TODO");
}

function onRemoveFile() {
  modelingOrderStore.removeAttachmentFileByLocalUrl(localUrl);
}

function toIconName2() {
  return toIconNameSafe(attachmentImage.value?.image);
}
</script>

<style>
</style>