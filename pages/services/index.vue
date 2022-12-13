<template>
  <div class="container px-12 py-6">
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-1">
        <div class="text-4xl font-bold">3d services</div>
        <div class="text-md">Choose which 3d service you require</div>
      </div>
      <div class="flex flex-col md:flex-row gap-10 justify-between items-center">
        <div class="flex-1 flex flex-col gap-3 text-center">
          <NuxtLink to="/services/printing">
            <div class="btn btn-outline hover:btn-info w-full h-[32vh]">
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
        <h1 class="text-2xl font-bold">OR</h1>
        <div class="flex-1 flex flex-col gap-3 text-center">
          <NuxtLink to="/services/modeling">
            <div class="btn btn-outline hover:btn-info w-full h-[32vh]">
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