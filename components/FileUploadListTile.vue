<template>
  <div class="card bg-base-100 shadow-md border p-8">
    <div class="flex flex-col gap-5">
      <div class="flex justify-between items-center text-gray-800">
        <Icon
          :name="icon"
          size="27"
        />
        <h2 class="card-title text-base">{{file.name}}</h2>
        <div class="flex gap-2 items-center">
          <div
            class="tooltip tooltip-bottom"
            data-tip="Duplicate"
          >
            <div
              class="btn btn-ghost btn-square btn-sm"
              @click="$emit('on-duplicate-file')"
            >
              <Icon
                name="material-symbols:content-copy-outline-rounded"
                size="24"
              />
            </div>
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
      <div class="grid grid-cols-2 gap-8">
        <div>
          <figure>
            <img
              src="https://placeimg.com/400/300/arch"
              alt="file"
              class="rounded"
            />
          </figure>
          <div class="py-5 px-0">
            <div class="">
              <table class="table table-compact w-full">
                <tbody>
                  <tr>
                    <th>File size</th>
                    <td>{{fileSize}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Material</span>
            </label>
            <select class="select select-bordered select-sm">
              <option
                disabled
                selected
              >Dummy 0 [TODO]</option>
              <option>Dummy 1 [TODO]</option>
              <option>Dummy 2 [TODO]</option>
            </select>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Color</span>
            </label>
            <select class="select select-bordered select-sm">
              <option
                disabled
                selected
              >Dummy 0 [TODO]</option>
              <option>Dummy 1 [TODO]</option>
              <option>Dummy 2 [TODO]</option>
            </select>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label p-1">
              <span class="label-text">Infill</span>
            </label>
            <select class="select select-bordered select-sm">
              <option
                disabled
                selected
              >Dummy 0 [TODO]</option>
              <option>Dummy 1 [TODO]</option>
              <option>Dummy 2 [TODO]</option>
            </select>
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        Price for this item is estimated at
        <strong>20$</strong>
        <div class="dropdown dropdown-end">
          <label
            tabindex="0"
            class="btn btn-circle btn-ghost btn-xs text-info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-4 h-4 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </label>
          <div
            tabindex="0"
            class="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
          >
            <div class="card-body">
              <h2 class="card-title">You needed more info?</h2>
              <p>Here is a description!</p>
            </div>
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
      <div class="card-actions justify-between items-end">
        <div class="flex justify-between items-center">
          <div class="btn-group gap-1 items-center">
            <button
              class="btn btn-outline btn-error btn-square btn-sm text-xl border-0 bg-gray-200"
              @click="decreaseQuantity"
            >-</button>
            <input
              type="text"
              v-model="quantity"
              class="input input-xs w-14 text-lg text-center"
            />
            <!-- <button class="btn btn-ghost btn-sm text-xl">{{quantity}}x</button> -->
            <button
              class="btn btn-outline btn-info btn-square btn-sm text-xl border-0 bg-gray-200"
              @click="increaseQuantity"
            >+</button>
          </div>

        </div>
        <div class="flex gap-2 items-end">
          <strong class="text-2xl"> $123</strong>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const { file } = defineProps(["file"]);

const quantity = ref<number>(1);

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

function increaseQuantity() {
  quantity.value = Number(quantity.value) + 1;
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value = Number(quantity.value) - 1;
  } else {
    quantity.value = 1;
  }
}
</script>

<style>
</style>