<template>
  <div class="flex items-center gap-4">
    <div>
      <Icon
        :name="icon"
        size="27"
      />
    </div>
    <div class="flex-1">
      {{file.name}}
    </div>
    <div>
      {{fileSize}}
    </div>
    <div
      class="btn btn-ghost btn-square"
      @click="$emit('on-remove-file')"
    >
      <Icon
        name="material-symbols:close"
        size="27"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { file } = defineProps(["file"]);

const icon = computed(() => {
  switch (filenameExtension(file.name)) {
    case "svg":
      return "carbon:svg";
    case "pdf":
      return "vscode-icons:file-type-pdf2";
    case "jpg":
    case "png":
    case "jpeg":
      return "material-symbols:image";
      return "material-symbols:image-outline-rounded";
      return "vscode-icons:file-type-image";
    default:
      return "vscode-icons:default-file";
  }
});

const fileSize = computed(() => {
  return fileSizeFormatted(file);
});
</script>

<style>
</style>