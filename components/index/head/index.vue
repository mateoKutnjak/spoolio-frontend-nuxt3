<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-12 md:px-0">
    <div class="flex flex-col gap-6 justify-center">
      <div class="mb-4 leading-loose">
        <span class="text-7xl font-bold text-stone-600">{{ capitalizeFirstLetter($t('make_your_ideas_alive_with_our') + " ") }}</span>
        <span class="text-7xl font-bold text-primary">{{ capitalizeFirstLetter($t('_3d_print') + " ") }}</span>
        <span class="text-7xl font-bold text-stone-600">{{ capitalizeFirstLetter($t('services')) }}</span>
      </div>
      <div class="space-x-1">
        <span class="text-xl font-medium text-stone-600">{{ capitalizeFirstLetter($t('order_verb')) }}</span>
        <span class="text-xl font-bold text-stone-600">{{ $t('_3d_model_printing') }}</span>
        <span class="text-xl font-medium text-stone-600">{{ $t('in_few_clicks_or_share_your_idea_so_we_can_do') }}</span>
        <span class="text-xl font-bold text-stone-600">{{ $t('_3d_modeling') }}</span>
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-8 items-end">
        <div>
          <div class="flex gap-2">
            <div class="text-sm font-medium text-stone-600">
              {{ capitalizeOnlyFirstLetter($t('supported_formats')) }}: STL
            </div>
          </div>
          <NuxtLink
            :to="localePath('/services/printing')"
            class="btn btn-block btn-lg btn-primary text-base-100"
          >{{ $t('i_have_a_model').toUpperCase() }}</NuxtLink>
        </div>
        <NuxtLink
          :to="localePath('/services/modeling')"
          class="btn btn-lg btn-outline text-stone-600 bg-white border border-stone-400"
        >{{ $t('i_dont_have_a_model').toUpperCase() }}</NuxtLink>
      </div>
    </div>
    <div class="hidden md:block bg-gray-400">
      Picture here
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
</script>
  
  <style>
</style>