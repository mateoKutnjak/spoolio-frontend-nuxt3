<template>
  <div class="bg-base-content flex flex-col md:flex-row space-x-6 px-12 md:px-0">
    <nuxt-img
      class="rounded-md w-full md:w-1/2"
      src="/img/workshop-1.jpg"
      alt="Workshop"
    />
    <div class="w-full md:w-1/2 flex flex-col gap-6 justify-center text-xl">
      <span class="text-5xl font-bold text-base-100">{{ $t('workshop').toUpperCase() }}</span>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-base-100">{{ capitalizeOnlyFirstLetter($t('our_workshop_and_printer_farm_is_located_in')) }}</span>
        <span class="font-bold text-base-100">{{ $t('zicer_complex_pavilion_12_velesajam_in_zagreb') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-base-100">{{ capitalizeOnlyFirstLetter($t('we_have_experience_in')) }}</span>
        <span class="font-bold text-base-100">{{ $t('cad_design') }},</span>
        <span class="text-base-100">{{ $t('especially_in_3d_design_for_3d_printing_needs') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-base-100">{{ capitalizeOnlyFirstLetter($t('in_addition_to_3d_printing')) }},</span>
        <span class="text-base-100">{{ $t('we_have_knowledge_and_experience_in_designing_and_working_with') }}</span>
        <span class="font-bold text-base-100">{{ $t('electronics_programming_and_prototyping') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-base-100">{{ capitalizeOnlyFirstLetter($t('that_is_why_in_addition_to_3d_printers_in_the_workshop_you_can_find_many_other_tools_to_solve_your_problems')) }}.</span>
      </div>
      <ButtonFindOutMore
        class="self-end"
        :to="localePath('/about')"
      />
    </div>
  </div>
</template>
    
    <script lang="ts" setup>
</script>
    
    <style>
</style>