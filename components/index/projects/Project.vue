<template>
    <NuxtLink :to="localePath(`/blogs/${blog.id}`)">
      <div class="h-full card rounded-md bg-accent">
  
        <div
          v-if="blog?.picture"
          class="flex items-center"
        >
          <nuxt-img
            class="h-48 w-full rounded-t-md"
            :src="blog.picture"
            style="object-fit: cover;"
          />
        </div>

        <div class="flex flex-col h-full justify-between py-3 px-4">
            <div class="flex flex-col justify-start">
                <div class="flex items-center pb-3">
                    <div class="text-gray-500 text-sm">
                    {{getDay + ' ' + getMonth + ' ' + getYear}}
                    </div>
                </div>
                <div class="pb-3">
                    <h2 class="card-title text-2xl font-bold text-base-content pb-2">{{blog.title}}</h2>
                    <p class="text-base-content text-base">{{blog.subtitle}}</p>
                </div>                
            </div>
            <div class="flex">
                <div
                    v-for="tag in blog.tags"
                    :key="tag.id"
                    class="pr-2"
                >
                    <BlogTag :title="tag.name" />
                </div>
            </div>
        </div>
      </div>
    </NuxtLink>
  </template>
  
  <script lang="ts" setup>
  import { IBlog } from "~~/constants/data";
  
  const { blog } = defineProps<{
    blog: IBlog;
  }>();

  const date = parseDate(blog?.created_at);
  const getYear = date.toLocaleDateString("en-US", {year: "numeric"});
  const getMonth = date.toLocaleDateString("en-US", {month: "short"});
  const getDay = date.toLocaleDateString("en-US", {day: "numeric"});
  </script>
  
  <style>
  </style>