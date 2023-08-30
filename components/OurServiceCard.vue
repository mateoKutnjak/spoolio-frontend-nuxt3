<template>
    <div class="flex-1 rounded-md bg-accent">
        <nuxt-img
            class="w-full"
            :src="getImageUrl(src)"
            :alt="alt"
          />
        <div class="px-10 py-8">
            <div class="flex w-full pb-6 justify-between">
                <div class="flex flex-col">
                    <div class="text-4xl font-bold">{{title}}</div>
                    <div class="text-xl font-light">({{ subtitle }})</div>
                </div>
                <div class="self-center flex">
                    <div class="mr-2 text-2xl font-bold text-primary">CIJENA:</div>
                    <div class="text-2xl font-bold" v-bind:class="[ price > 0 ? 'text-primary' : 'text-neutral opacity-60']">€</div>
                    <div class="text-2xl font-bold" v-bind:class="[ price > 1 ? 'text-primary' : 'text-neutral opacity-60']">€</div>
                    <div class="text-2xl font-bold" v-bind:class="[ price > 2 ? 'text-primary' : 'text-neutral opacity-60']">€</div>
                </div>
            </div>
            <div class="flex" v-for="comment in comments">
                <Icon
                    class="text-primary mr-2"
                    name="mdi:chevron-right"
                    size="35"
                />
                <div class="self-center text-xl">
                    {{ comment }}
                </div>                
            </div>
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
        const url = `../img${path}`;
        return new URL(url, import.meta.url).href;
    }

</script>

<style>
</style>