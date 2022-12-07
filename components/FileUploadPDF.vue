<template>
  <div class="card bg-base-100 shadow-md border-4 border-gray-300 p-6">
    <div class="flex flex-col gap-5">
      <div class="flex gap-5 justify-between text-gray-800">
        <div class="flex gap-2">
          <Icon
            class="min-w-min"
            name="vscode-icons:file-type-pdf2"
            size="27"
          />
          <h2 class="card-title text-base break-all">{{pdfFilename}}</h2>
        </div>

        <div class="flex gap-2">
          <div
            class="btn btn-ghost btn-square btn-sm"
            @click="(isPdfPreviewShown=true)"
          >
            <Icon
              name="material-symbols:menu-book-outline-rounded"
              size="27"
            />
          </div>
          <div
            class="btn btn-ghost btn-square btn-sm"
            @click="$emit('on-remove-file')"
          >
            <Icon
              name="material-symbols:close"
              size="27"
            />
          </div>

        </div>
      </div>
      <div>
        <div class="form-control">
          <textarea
            class="textarea textarea-bordered h-24"
            placeholder="Additional information"
          ></textarea>
        </div>
      </div>
    </div>
  </div>

  <GenericDialog
    :show="isPdfPreviewShown"
    dialog-panel-style="max-w-md"
    @on-close-clicked="isPdfPreviewShown=false"
  >
    <embed
      class="w-[90vw] h-[90vh]"
      :src="url"
    />
  </GenericDialog>
</template>

<script lang="ts" setup>
const { pdfFilename, url } = defineProps(["pdfFilename", "url"]);

const isPdfPreviewShown = ref<boolean>(false);
</script>

<style>
</style>