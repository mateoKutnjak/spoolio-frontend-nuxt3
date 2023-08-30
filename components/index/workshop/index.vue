<template>
  <div class="relative left-[calc(-50vw+50%)] w-screen bg-base-content border-primary border-y-4 py-20 mb-32">
    <div class="container flex flex-col lg:flex-row mx-auto lg:space-x-12 lg:space-y-0 space-y-10">
      <div class="flex flex-col w-full lg:w-1/2">
        <div class="xl:text-7xl md:text-6xl font-bold text-base-100 pb-6">{{ $t('workshop').toUpperCase() }}</div>
        <nuxt-img
          class="rounded-md self-center grow-0 border-primary border-4"
          src="/img/workshop-1.jpg"
          alt="Workshop"
        />
      </div>
      <div class="w-full lg:w-1/2 flex flex-col 2xl:space-y-5 xl:space-y-2 justify-end text-xl">
        <div class="space-x-1.5 tracking-wide">
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ capitalizeOnlyFirstLetter($t('our_workshop_and_printer_farm_is_located_in')) }}</span>
          <span class="2xl:text-2xl xl:text-xl font-bold text-base-100">{{ $t('zicer_complex_pavilion_12_velesajam_in_zagreb') }}.</span>
        </div>
        <div class="space-x-1.5 tracking-wide">
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ capitalizeOnlyFirstLetter($t('we_have_experience_in')) }}</span>
          <span class="2xl:text-2xl xl:text-xl font-bold text-base-100">{{ $t('cad_design') }},</span>
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ $t('especially_in_3d_design_for_3d_printing_needs') }}.</span>
        </div>
        <div class="space-x-1.5 tracking-wide">
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ capitalizeOnlyFirstLetter($t('in_addition_to_3d_printing')) }},</span>
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ $t('we_have_knowledge_and_experience_in_designing_and_working_with') }}</span>
          <span class="2xl:text-2xl xl:text-xl font-bold text-base-100">{{ $t('electronics_programming_and_prototyping') }}.</span>
        </div>
        <div class="space-x-1.5 tracking-wide">
          <span class="2xl:text-2xl xl:text-xl text-base-100">{{ capitalizeOnlyFirstLetter($t('that_is_why_in_addition_to_3d_printers_in_the_workshop_you_can_find_many_other_tools_to_solve_your_problems')) }}.</span>
        </div>
        <ButtonFindOutMore
          class="self-end"
          :to="localePath('/about')"
        />
      </div>
    </div>
  </div>
</template>
    
    <script lang="ts" setup>
</script>
    
    <style>
</style>