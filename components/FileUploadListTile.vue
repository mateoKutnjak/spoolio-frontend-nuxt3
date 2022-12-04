<template>
  <div
    v-if="uploadedFile.type === 'application/pdf'"
    class="flex flex-col"
  >
    <FileUploadPDF
      class="flex-1"
      :pdfFilename="uploadedFile.name"
      :url="uploadedFileUrl"
      @on-remove-file="$emit('on-remove-file')"
      @on-preview-file="$emit('on-preview-file')"
    />
  </div>
  <div v-else-if="uploadedFile.type === 'image/jpeg'">
    <FileUploadImage
      :imageFile="uploadedFile"
      :imageFileUrl="uploadedFileUrl"
      @on-duplicate-file="$emit('on-duplicate-file')"
      @on-remove-file="$emit('on-remove-file')"
    />
  </div>
  <div v-else>
    <FileUploadOther
      :file="uploadedFile"
      :fileUrl="uploadedFileUrl"
      @on-duplicate-file="$emit('on-duplicate-file')"
      @on-remove-file="$emit('on-remove-file')"
    />
  </div>
</template>

<script lang="ts" setup>
const { uploadedFile, uploadedFileUrl } = defineProps([
  "uploadedFile",
  "uploadedFileUrl",
]);
console.log(uploadedFile);
</script>

<style>
</style>