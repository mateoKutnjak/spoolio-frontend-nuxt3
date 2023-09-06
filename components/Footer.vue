<template>
  <footer
    class="pt-9 pb-4 bg-base-content text-base-100 border-t-4 border-primary"
  >
    <div class="container mx-auto">
      
      <div class="flex flex-row justify-between pb-8 border-b-2 border-base-100">
    
        <div class="flex flex-col w-[65%]">
          <nuxt-img
            width="150px"
            src="/img/ur3d-light.svg"
            alt="logo"
            class="pb-16 mt-1"
          />

          <div class="flex justify-between">

            <div class="flex flex-col mr-5">
              <div class="text-xl font-bold pb-4">KONTAKT</div>
              <div class="flex mb-2">
                <Icon
                    class="text-base-100 mr-3 self-center"
                    name="mdi:email-outline"
                    size="22"
                />
                <div class="text-lg self-center">info.ur3d@gmail.com</div>
              </div>
              <div class="flex">
                <Icon
                    class="text-base-100 mr-3 self-center"
                    name="mdi:phone"
                    size="22"
                />
                <div class="text-lg self-center">(+385) 99 240 3536</div>
              </div>
            </div>

            <div class="flex flex-col mr-5">
              <div class="text-xl font-bold pb-4">USLUGE</div>
              <div class="text-lg mb-2">3D Printanje</div>
              <div class="text-lg">3D Modeliranje</div>
            </div>

            <div class="flex flex-col mr-5">
              <div class="text-xl font-bold pb-4">TVRTKA</div>
              <div class="text-lg mb-2">O nama</div>
              <div class="text-lg">Politika Privatnosti</div>
            </div>

          </div>
        
        </div>

        <div class="self-end w-[30%] pl-10">
          <div class="font-bold">Podaci o obrtu</div>
          <div class="text-sm">Spoolio, obrt za proizvodnju i usluge, vl. Bojan Spahija</div>
          <div class="text-sm">Međimurska ulica 5, 10000 Zagreb</div>
          <div class="text-sm mb-6">OIB: 89843153481, Broj obrtnice: 21010148579</div>

          <div class="font-bold">Račun</div>
          <div class="text-sm">Hrvatska poštanska banka d.d.</div>
          <div class="text-sm">IBAN: HR5423900011101301106</div>
        </div>
      </div>

      <div class="flex mt-4 justify-between">
        <div class="flex">
          <Icon
            class="text-base-100 mr-3 self-center"
            name="bx:bxl-youtube"
            size="35"
          />
          <Icon
            class="text-base-100 mr-3 self-center"
            name="mdi:instagram"
            size="35"
          />
          <Icon
            class="text-base-100 mr-3 self-center"
            name="ic:baseline-tiktok"
            size="35"
          />
        </div>
        
        <div class="flex">
          <Icon
            class="text-base-100 mr-1 self-center"
            name="material-symbols:copyright-outline"
            size="20"
          />
          <div class="self-center font-bold text-lg">2023 by UR3D</div>
        </div>

      </div>
    
    </div>
  </footer>
</template>

<script lang="ts" setup>
</script>
<style>
</style>