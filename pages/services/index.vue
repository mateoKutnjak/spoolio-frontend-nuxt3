<template>
  <div class="container px-12 py-6">
    <div class="px-12 py-8 flex flex-col gap-12">
      <div class="flex flex-col lg:flex-row gap-10 justify-between items-stretch lg:items-center">
        <div class="flex-1 flex flex-col gap-3 text-center">
          <NuxtLink to="/services/printing">
            <div class="btn btn-outline bg-white hover:btn-info w-full h-[32vh] border-gray-400">
              <div class="flex flex-col gap-3 items-center">
                <Icon
                  name="file-icons:3d-model"
                  size="50"
                />
                3d printing
              </div>
            </div>
          </NuxtLink>
          <h1 class="text-lg italic">"Print some 3D files for me"</h1>
        </div>
        <div class="flex-1 flex flex-col gap-3 text-center">
          <NuxtLink to="/services/modeling">
            <div class="btn btn-outline bg-white hover:btn-success w-full h-[32vh] border-gray-400">
              <div class="flex flex-col gap-3 items-center">
                <Icon
                  name="material-symbols:design-services"
                  size="50"
                />
                Modeling
              </div>
            </div>
          </NuxtLink>
          <h1 class="text-lg italic">"Help me create my 3D idea"</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>