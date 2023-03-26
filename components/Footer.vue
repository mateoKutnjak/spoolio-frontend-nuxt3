<template>
  <footer class="footer p-10 bg-base-100 text-base-content shadow">
    <div>
      <span class="footer-title">Services</span>
      <NuxtLink
        to="/services/printing"
        class="link link-hover"
      >Printing</NuxtLink>
      <NuxtLink
        to="/services/modeling"
        class="link link-hover"
      >Modeling</NuxtLink>
    </div>
    <div>
      <span class="footer-title">Company</span>
      <NuxtLink
        to="about"
        class="link link-hover"
      >About us</NuxtLink>
      <a class="link link-hover">Contact</a>
    </div>
    <div>
      <span class="footer-title">Legal</span>
      <a class="link link-hover">Terms of use</a>
      <a class="link link-hover">Privacy policy</a>
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
      <div class="grid grid-flow-col gap-4">
        <a>
          <Icon
            name="logos:youtube-icon"
            size="30"
          />
        </a>
        <a>
          <Icon
            name="logos:twitter"
            size="30"
          />
        </a>
        <a>
          <Icon
            name="logos:facebook"
            size="28"
          />
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>
<style>
</style>