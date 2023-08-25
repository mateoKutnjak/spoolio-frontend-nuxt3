<template>
  <div class="relative left-[calc(-50vw+50%)] w-screen z-0">
    <Icon
        class="absolute text-primary top-[-100px] left-[-110px] opacity-50 sm:h-[400px] h-[250px] sm:w-[400px] w-[250px]"
        name="mdi:numeric-1-circle-outline"
    />
  </div>

  <div class="z-10 flex flex-col gap-10">
    <div>
      Usluga 3D printanja
    </div>
    <div class="flex md:flex-row flex-col gap-10">
      <div class="h-40 flex-1 border-2 border-primary">
      </div>
      <div class="h-40 flex-1 border-2 border-primary">
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { usePrintingMethodStore } from "~~/stores/printing_method";

const printingMethodStore = usePrintingMethodStore();

const { data, pending, error, refresh } = await useAsyncData(
  "index_our_services_printing_methods",
  () => printingMethodStore.fetch()
);
</script>
  
  <style>
</style>