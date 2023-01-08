<template>
  <div class="container px-12 py-12">
    <div class="flex flex-wrap gap-10 justify-center">
      <div class="flex flex-col gap-3 text-center">
        <NuxtLink to="/services/printing">
          <div class="btn btn-info h-44 w-52">
            <div class="flex flex-col gap-3 items-center text-gray-800">
              <Icon
                name="file-icons:3d-model"
                size="50"
              />
              3d printing
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-md italic font-medium text-gray-500">"Print some 3D files for me"</h1>
      </div>
      <div class="flex flex-col gap-3 text-center">
        <NuxtLink to="/services/modeling">
          <div class="btn btn-success h-44 w-52">
            <div class="flex flex-col gap-3 items-center text-gray-800">
              <Icon
                name="material-symbols:design-services"
                size="50"
              />
              Modeling
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-md italic font-medium text-gray-500">"Help me create my 3D idea"</h1>
      </div>
      <div class="flex flex-col gap-3 text-center">
        <NuxtLink to="/store">
          <div class="btn btn-warning h-44 w-52">
            <div class="flex flex-col gap-3 items-center text-gray-800">
              <Icon
                name="mdi:chip"
                size="50"
              />
              Web shop
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-md italic font-medium text-gray-500">"I want to buy 3D printer products"</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>