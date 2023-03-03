<template>
  <div class="container px-12 py-12">
    <div class="flex flex-col gap-12">
      <div class="text-4xl font-light">Services</div>
      <div class="flex flex-wrap gap-10 justify-center">
        <div class="flex flex-col gap-3 text-center w-52">
          <NuxtLink to="/services/printing">
            <div class="btn btn-info h-44 w-52 shadow-md rounded-3xl">
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
        <div class="flex flex-col gap-3 text-center w-52">
          <NuxtLink to="/services/modeling">
            <div class="btn btn-success h-44 w-52 shadow-md rounded-3xl">
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
        <div class="flex flex-col gap-3 text-center w-52">
          <NuxtLink to="/store">
            <div class="btn btn-warning h-44 w-52 shadow-md rounded-3xl">
              <div class="flex flex-col gap-3 items-center text-gray-800">
                <Icon
                  name="mdi:chip"
                  size="50"
                />
                Web shop
              </div>
            </div>
          </NuxtLink>
          <h1 class="text-md italic font-medium text-gray-500">"I want to buy your 3D printer products"</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>