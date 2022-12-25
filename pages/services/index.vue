<template>
  <div class="container px-12 py-6">
    <div class="px-12 py-8 flex flex-col gap-12">
      <div class="flex flex-col md:flex-row gap-10 justify-between items-stretch md:items-center">
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
          <h1 class="text-md">I have some files I want to 3d print</h1>
        </div>
        <h1 class="text-2xl font-bold text-center pb-4 md:pb-8">OR</h1>
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
          <h1 class="text-md">I have an idea & need your 3d design</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>