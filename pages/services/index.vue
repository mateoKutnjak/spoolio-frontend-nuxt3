<template>
  <div class="container px-12 py-6">
    <div class="flex flex-wrap gap-10 justify-center">
      <div class="flex flex-col gap-3 text-center w-48">
        <NuxtLink to="/services/printing">
          <div class="btn btn-outline bg-white hover:btn-info h-40 w-48 border-gray-400">
            <div class="flex flex-col gap-3 items-center text-gray-600">
              <Icon
                name="file-icons:3d-model"
                size="50"
              />
              3d printing
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-lg italic text-gray-600">"Print some 3D files for me"</h1>
      </div>
      <div class="flex flex-col gap-3 text-center w-48">
        <NuxtLink to="/services/modeling">
          <div class="btn btn-outline bg-white hover:btn-success h-40 w-48 border-gray-400">
            <div class="flex flex-col gap-3 items-center text-gray-600">
              <Icon
                name="material-symbols:design-services"
                size="50"
              />
              Modeling
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-lg italic text-gray-600">"Help me create my 3D idea"</h1>
      </div>
      <div class="flex flex-col gap-3 text-center w-48">
        <NuxtLink to="/services/modeling">
          <div class="btn btn-outline bg-white hover:btn-success h-40 w-48 border-gray-400">
            <div class="flex flex-col gap-3 items-center text-gray-600">
              <Icon
                name="material-symbols:design-services"
                size="50"
              />
              Modeling
            </div>
          </div>
        </NuxtLink>
        <h1 class="text-lg italic text-gray-600">"Help me create my 3D idea"</h1>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>