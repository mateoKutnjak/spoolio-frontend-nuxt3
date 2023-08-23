<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 px-12 md:px-0 h-screen w-full">
    <nuxt-img
      class="absolute left-0 right-0 bottom-0 h-full w-full object-cover"
      src="/img/index_head.jpeg"
      alt="logo"
    />
    <div class="absolute left-0 right-0 bottom-0 h-full w-screen bg-gradient-to-l from-transparent to-base-content" />

    <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-0 text-primary text-2xl font-bold">
      <div>{{ $t('services') }}</div>
      <Icon
        class="text-primary -mt-2 mb-2"
        name="ic:round-keyboard-arrow-down"
        size="40"
      />
    </div>
    <div class="flex flex-col gap-8 justify-center z-[1]">
      <div class="mb-4 leading-loose ">
        <span class="lg:text-8xl md:text-7xl text-5xl font-bold text-base-100">{{ capitalizeFirstLetter($t('make_your_ideas_alive_with_our') + " ") }}</span>
        <span class="lg:text-8xl md:text-7xl text-5xl font-bold text-primary">{{ capitalizeFirstLetter($t('_3d_print') + " ") }}</span>
        <span class="lg:text-8xl md:text-7xl text-5xl font-bold text-base-100">{{ capitalizeFirstLetter($t('services')) }}</span>
      </div>
      <div class="space-x-1">
        <span class="md:text-2xl text-xl font-medium text-base-100">{{ capitalizeFirstLetter($t('order_verb')) }}</span>
        <span class="md:text-2xl text-xl font-bold text-base-100">{{ $t('_3d_model_printing') }}</span>
        <span class="md:text-2xl text-xl font-medium text-base-100">{{ $t('in_few_clicks_or_share_your_idea_so_we_can_do') }}</span>
        <span class="md:text-2xl text-xl font-bold text-base-100">{{ $t('_3d_modeling') }}</span>
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 md:gap-8 gap-2 items-end">
        <div>
          <div class="flex gap-2">
            <div class="text-base font-light text-base-100">
              {{ capitalizeOnlyFirstLetter($t('supported_formats')) }}: STL
            </div>
          </div>
          <NuxtLink
            :to="localePath('/services/printing')"
            class="btn btn-block sm:btn-lg btn-primary text-base-100"
          >{{ $t('i_have_a_model').toUpperCase() }}</NuxtLink>
        </div>
        <NuxtLink
          :to="localePath('/services/modeling')"
          class="btn sm:btn-lg btn-outline text-stone-600 bg-white border border-stone-400"
        >{{ $t('i_dont_have_a_model').toUpperCase() }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
</script>
  
  <style>
</style>