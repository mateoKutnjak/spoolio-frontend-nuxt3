<template>
  <NuxtLink :to="localePath(`/blogs/${blog.id}`)">
    <div class="h-full card gap-6">

      <div
        v-if="blog?.picture"
        class="rounded-none flex items-center"
      >
        <nuxt-img
          class="h-48 w-full"
          :src="blog.picture"
          style="object-fit: cover;"
        />
      </div>
      <div class="card-body gap-3 justify-start py-2 sm:p-0">
        <div class="flex gap-4 items-center font-sans">
          <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
              <span class="text-sm">{{ userProfileInitials(blog.author?.profile) }}</span>
            </div>
          </div>
          <div class="text-gray-500 text-sm">
            {{reformatDate(blog?.created_at)}}
          </div>
        </div>
        <div class="py-0">
          <h2 class="card-title text-xl text-gray-700 pb-1 font-sans">{{blog.title}}</h2>
          <p class="text-gray-600 font-sans text-sm">{{blog.subtitle}}</p>
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
</script>

<style>
</style>