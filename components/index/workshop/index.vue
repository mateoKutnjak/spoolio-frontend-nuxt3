<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-12 md:px-0">
    <div class="bg-gray-400">
      Picture here
    </div>
    <div class="flex flex-col gap-6 justify-center">
      <span class="text-3xl font-bold text-stone-600">{{ $t('workshop').toUpperCase() }}</span>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('our_workshop_and_printer_farm_is_located_in')) }}</span>
        <span class="text-lg font-bold text-stone-600">{{ $t('zicer_complex_pavilion_12_velesajam_in_zagreb') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('we_have_experience_in')) }}</span>
        <span class="text-lg font-bold text-stone-600">{{ $t('cad_design') }},</span>
        <span class="text-lg text-stone-600">{{ $t('especially_in_3d_design_for_3d_printing_needs') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('in_addition_to_3d_printing')) }},</span>
        <span class="text-lg text-stone-600">{{ $t('we_have_knowledge_and_experience_in_designing_and_working_with') }}</span>
        <span class="text-lg font-bold text-stone-600">{{ $t('electronics_programming_and_prototyping') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('that_is_why_in_addition_to_3d_printers_in_the_workshop_you_can_find_many_other_tools_to_solve_your_problems')) }}.</span>
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