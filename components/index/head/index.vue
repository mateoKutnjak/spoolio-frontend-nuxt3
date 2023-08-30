<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 px-0 h-screen w-full mb-32">
    <nuxt-img
      class="absolute left-0 right-0 bottom-0 h-full w-full object-cover border-primary border-b-4"
      src="/img/index_head.jpeg"
      alt="logo"
    />
    <div class="absolute left-0 right-0 bottom-0 h-full w-screen bg-gradient-to-l from-transparent to-base-content" />

    <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-0 text-primary text-2xl font-bold">
      <div>{{ $t('services') }}</div>
      <Icon
        class="text-primary -mt-2 mb-3"
        name="ic:round-keyboard-arrow-down"
        size="40"
      />
    </div>
    <div class="col-span-3 flex flex-col justify-center z-[1]">
      <div class="lg:mt-20 mt-12 mb-12 leading-loose ">
        <span class="xl:text-8xl md:text-7xl text-5xl font-bold text-base-100">{{ capitalizeFirstLetter($t('make_your_ideas_alive_with_our') + " ") }}</span>
        <span class="xl:text-8xl md:text-7xl text-5xl font-bold text-primary">{{ capitalizeFirstLetter($t('_3d_print') + " ") }}</span>
        <span class="xl:text-8xl md:text-7xl text-5xl font-bold text-base-100">{{ capitalizeFirstLetter($t('services')) }}</span>
      </div>
      <div class="mb-6 space-x-1">
        <span class="xl:text-3xl sm:text-xl text-lg font-medium text-base-100">{{ capitalizeFirstLetter($t('order_verb')) }}</span>
        <span class="xl:text-3xl sm:text-xl text-lg font-bold text-base-100">{{ $t('_3d_model_printing') }}</span>
        <span class="xl:text-3xl sm:text-xl text-lg font-medium text-base-100">{{ $t('in_few_clicks_or_share_your_idea_so_we_can_do') }}</span>
        <span class="xl:text-3xl sm:text-xl text-lg font-bold text-base-100">{{ $t('_3d_modeling') }}</span>
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
            class="btn btn-block sm:btn-lg xl:!text-3xl sm:!text-2xl xl:!h-20 btn-primary text-base-100"
          >{{ $t('i_have_a_model').toUpperCase() }}</NuxtLink>
        </div>
        <NuxtLink
          :to="localePath('/services/modeling')"
          class="btn sm:btn-lg btn-outline xl:!text-3xl sm:!text-2xl xl:!h-20 text-primary border-4 border-primary"
        >{{ $t('i_dont_have_a_model').toUpperCase() }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
</script>
  
  <style>
</style>