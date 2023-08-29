<template>
    <div class="flex-1 rounded-md">
        <nuxt-img
            class="w-full"
            :src="getImageUrl(src)"
            :alt="alt"
          />
        <div class="flex w-full px-10 py-6 justify-between">
            <div class="flex flex-col">
                <div class="text-4xl font-bold">{{title}}</div>
                <div class="text-xl font-light">({{ subtitle }})</div>
            </div>
            <div class="self-center flex">
                <div class="mr-2 text-2xl font-bold text-primary">CIJENA:</div>
                <div class="text-2xl font-bold" v-bind:class="[ price > 0 ? 'text-primary' : 'text-accent']">€</div>
                <div class="text-2xl font-bold" v-bind:class="[ price > 1 ? 'text-primary' : 'text-accent']">€</div>
                <div class="text-2xl font-bold" v-bind:class="[ price > 2 ? 'text-primary' : 'text-accent']">€</div>
            </div>
        </div>
        <div v-for="comment in comments">
            {{ comment }}
        </div>       
    </div>
  </template>

<script lang="ts" setup>
    const {src, alt, title, subtitle, price, comments} = defineProps<{
        src: string;
        alt: string;
        title: string;
        subtitle: string;
        price: number;
        comments: string[];
    }>();

    function getImageUrl(path: string){
        const url = `../public/img${path}`;
        return new URL(url, import.meta.url).href;
    }

</script>

<style>
</style>