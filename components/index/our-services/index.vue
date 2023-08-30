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
      <div class="flex md:flex-row flex-col lg:space-x-6 md:space-x-4 space-x-0 mb-4">
        <OurServiceCard class="md:mb-0 mb-4" src="/services_FDM.png" alt="FDM Service" title="FDM Metoda" subtitle="Fused Deposition Modeling" :price="1" :comments="comments_FDM"/>
        <OurServiceCard src="/services_SLA.png" alt="SLA Service" title="SLA Metoda" subtitle="Stereolithography" :price="2" :comments="comments_SLA"/>
      </div>
      <div class="flex md:flex-row flex-col lg:space-x-6 md:space-x-4 space-x-0">
        <div class="md:w-1/2 w-full">
          <NuxtLink
              :to="localePath('/services/printing')"
              class="btn btn-block lg:mr-6 md:mr-4 mr-0 sm:btn-lg xl:!text-3xl sm:!text-2xl xl:!h-20 btn-primary text-base-100"
            >NARUČI 3D PRINT
          </NuxtLink>
        </div>
        <div class="flex md:order-last order-first md:w-1/2 w-full md:justify-end justify-start">
          <ButtonFindOutMore
          class="self-center"
          :to="localePath('/about')"
          />
        </div>      
      </div>    
    </div>

    <div class="relative left-[calc(-50vw+50%)] w-screen z-0">
      <Icon
          class="absolute text-primary top-[-100px] right-[-110px] opacity-50 sm:h-[400px] h-[250px] sm:w-[400px] w-[250px]"
          name="mdi:numeric-2-circle-outline"
      />
    </div>

    <div class="z-10 flex flex-col mb-32">
      <div class="xl:text-7xl xl:pb-10 md:text-6xl md:pb-8 sm:text-5xl sm:pb-5 text-4xl font-bold text-content-100 uppercase">
        Usluga 3D modeliranja
      </div>
      <div class="flex md:flex-row flex-col lg:space-x-6 md:space-x-4 space-x-0 mb-4">
        <div class="md:w-1/2 w-full flex flex-col">

          <div class="flex flex-col my-10 grow justify-center">
            <div class="flex mb-6">
              <Icon
                class="text-primary mr-4 self-center"
                name="material-symbols:design-services"
                size="45"
              />
              <div class="self-center text-2xl">
                Dizajn 3D modela prema Vašim nacrtima i opisu
              </div>
            </div>
            <div class="flex mb-6">
              <Icon
                class="text-primary mr-4 self-center"
                name="mdi:cube-scan"
                size="45"
              />
              <div class="self-center text-2xl">
                Rekonstrukcija postojećeg predmeta u digitalni format
              </div>
            </div>
            <div class="flex md:mb-6">
              <Icon
                class="text-primary mr-4 self-center"
                name="mdi:hammer-wrench"
                size="45"
              />
              <div class="self-center text-2xl">
                Dorada postojećeg 3D modela
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <div class="w-full">
              <NuxtLink
                  :to="localePath('/services/printing')"
                  class="btn btn-block lg:mr-6 md:mr-4 mr-0 sm:btn-lg xl:!text-3xl sm:!text-2xl xl:!h-20 btn-primary text-base-100"
                >NARUČI 3D MODEL
              </NuxtLink>
            </div>
            <div class="flex order-first w-full justify-start">
              <ButtonFindOutMore
                class="self-center"
                :to="localePath('/about')"
              />
            </div>      
          </div>

        </div>
        <div class="flex flex-col justify-center md:order-last order-first md:w-1/2 w-full">
          <nuxt-img
            class="w-full"
            src="/img/services_modeling.png"
            alt="Modeliranje"
          />
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