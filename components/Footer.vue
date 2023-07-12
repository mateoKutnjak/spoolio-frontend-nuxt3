<template>
  <footer
    class="footer p-10 bg-base-100 text-lg"
    style="box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1);"
  >
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('services')) }}</span>
      <NuxtLink
        :to="localePath('/services/printing')"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('printing')) }}</NuxtLink>
      <NuxtLink
        :to="localePath('/services/modeling')"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('modeling')) }}</NuxtLink>
    </div>
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('company')) }}</span>
      <NuxtLink
        :to="localePath('/about')"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('about')) }}</NuxtLink>
      <a class="link link-hover">{{ capitalizeOnlyFirstLetter($t('contact')) }}</a>
    </div>
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('legal')) }}</span>
      <a class="link link-hover">{{ capitalizeOnlyFirstLetter($t('terms_of_use')) }}</a>
      <NuxtLink
        class="link link-hover"
        :to="localePath('/privacy-policy')"
      >{{ capitalizeOnlyFirstLetter($t('privacy_policy')) }}</NuxtLink>
    </div>
  </footer>
  <footer class="
        footer
        px-10
        py-4
        border-t
        bg-base-100
        text-lg
        border-base-300">
    <div class="items-center grid-flow-col">
      <nuxt-img
        width="110px"
        src="/img/logo-primary.svg"
        alt="logo"
      />
      <p class="mt-1.5 ml-1 font-medium">obrt za proizvodnju i usluge <br /></p>
    </div>
    <div class="md:place-self-center md:justify-self-end">
      <div class="-mt-2 grid grid-flow-col gap-1">
        <div class="btn btn-ghost btn-square">
          <Icon
            class="text-[#FF0000]"
            name="bxl:youtube"
            size="35"
          />
        </div>
        <div class="btn btn-ghost btn-square">
          <Icon
            class="text-[#1DA1F2]"
            name="bxl:twitter"
            size="35"
          />
        </div>
        <div class="btn btn-ghost btn-square">
          <Icon
            class="text-[#4267B2]"
            name="bxl:facebook-square"
            size="33"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
</script>
<style>
</style>