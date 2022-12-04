<template>
  <div class="card bg-base-100 shadow-md border-4 border-gray-300 p-8">
    <div class="flex flex-col gap-5">
      <div class="flex justify-between text-gray-800">
        <div class="flex gap-2">
          <Icon
            name="material-symbols:image"
            size="27"
          />
          <h2 class="card-title text-base break-all">{{imageFile.name}}</h2>
        </div>

        <div class="flex gap-2">
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
      <div class="grid grid-cols-1 gap-8">
        <button>
          <figure class="border-2">
            <img
              class="aspect-square object-cover"
              :src="imageFileUrl"
              alt="file"
              @click="(isImagePreviewShown=true)"
            />
          </figure>
        </button>
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
    :show="isImagePreviewShown"
    @on-close-clicked="isImagePreviewShown=false"
  >
    <embed
      class="w-[90vw] h-[90vh]"
      :src="imageFileUrl"
    />
  </GenericDialog>
</template>

<script lang="ts" setup>
const { imageFile, imageFileUrl } = defineProps(["imageFile", "imageFileUrl"]);

const isImagePreviewShown = ref<boolean>(false);
</script>

<style>
</style>