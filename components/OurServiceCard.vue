<template>
    <div class="flex-1 rounded-md">
        <nuxt-img
            class="w-full"
            :src="getImageUrl(src)"
            :alt="alt"
          />
    </div>
  </template>

<script lang="ts" setup>
    const {src, alt} = defineProps<{
        src: string;
        alt: string;
    }>();

    function getImageUrl(path: string){
        const url = `../img${path}`;
        return new URL(url, import.meta.url).href;
    }

</script>

<style>
</style>