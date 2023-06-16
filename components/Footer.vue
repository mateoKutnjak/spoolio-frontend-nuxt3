<template>
  <footer
    class="footer p-10 bg-base-100 text-base-content"
    style="box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1);"
  >
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('services')) }}</span>
      <NuxtLink
        to="/services/printing"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('printing')) }}</NuxtLink>
      <NuxtLink
        to="/services/modeling"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('modeling')) }}</NuxtLink>
    </div>
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('company')) }}</span>
      <NuxtLink
        to="/about"
        class="link link-hover"
      >{{ capitalizeOnlyFirstLetter($t('about')) }}</NuxtLink>
      <a class="link link-hover">{{ capitalizeOnlyFirstLetter($t('contact')) }}</a>
    </div>
    <div>
      <span class="footer-title">{{ capitalizeOnlyFirstLetter($t('legal')) }}</span>
      <a class="link link-hover">{{ capitalizeOnlyFirstLetter($t('terms_of_use')) }}</a>
      <a class="link link-hover">{{ capitalizeOnlyFirstLetter($t('privacy_policy')) }}</a>
    </div>
  </footer>
  <footer class="footer px-10 py-4 border-t bg-base-100 text-base-content border-base-300">
    <div class="items-center grid-flow-col">
      <nuxt-img
        width="90px"
        src="/img/logo-primary.svg"
        alt="logo"
      />
      <p class="mt-1">obrt za proizvodnju i usluge <br /></p>
    </div>
    <div class="md:place-self-center md:justify-self-end">
      <div class="grid grid-flow-col">
        <a>
          <Icon
            class="text-[#888888] mr-4 pb-0.5"
            name="lucide:youtube"
            size="34"
          />
        </a>
        <a>
          <Icon
            class="text-[#888888] mr-2.5"
            name="lucide:twitter"
            size="30"
          />
        </a>
        <a>
          <Icon
            class="text-[#888888] pb-0.5"
            name="lucide:facebook"
            size="30"
          />
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>
<style>
</style>