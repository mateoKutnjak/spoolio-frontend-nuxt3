<template>
  <div class="relative left-[calc(-50vw+50%)] w-screen z-0">
    <Icon
        class="absolute text-primary top-[-100px] left-[-110px] opacity-50 sm:h-[400px] h-[250px] sm:w-[400px] w-[250px]"
        name="mdi:numeric-1-circle-outline"
    />
  </div>

  <div class="z-10 flex flex-col mb-32">
    <div class="xl:text-7xl xl:pb-10 md:text-6xl md:pb-8 sm:text-5xl sm:pb-5 text-4xl font-bold text-content-100 uppercase">
      Usluga 3D printanja
    </div>
    <div class="flex md:flex-row flex-col lg:space-x-6 md:space-x-4 md:space-y-0 space-y-4">
      <OurServiceCard src="/services_FDM.png" alt="FDM Service" title="FDM Metoda" subtitle="Fused Deposition Modeling" price="1" :comments="comments_FDM"/>
      <OurServiceCard src="/services_SLA.png" alt="SLA Service" title="SLA Metoda" subtitle="Stereolithography" price="2" :comments="comments_SLA"/>
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

const comments_FDM = [
  "Prikladno za veće i jednostavnije modele",
  "Veća čvrstoća dijelova naspram SLA metode",
  "Jeftiniji i brži proces",
  "Vidljivi slojevi"
]

const comments_SLA = [
  "Prikladno za manje i kompleksne modele",
  "Bolja preciznost i izgled od FDM metode",
  "Glatka površina bez dorade",
  "Moguće dobiti prozirne dijelove"
]
</script>
  
  <style>
</style>