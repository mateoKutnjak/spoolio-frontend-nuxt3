<template>
  <TransitionRoot
    v-if="blog"
    appear
    :show="true"
    as="div"
    enter="transform transition duration-[1000ms]"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transform duration-200 transition ease-in-out"
    leave-from="opacity-100 "
    leave-to="opacity-0"
  >
    <div class="relative">
      <nuxt-img
        v-if="blog?.picture"
        class="h-[25rem] w-full object-cover"
        :src="blog.picture"
      />
      <div v-else>
        <EmptyPlaceholder class="h-[25rem] w-full" />
      </div>
      <div :class="`absolute h-[25rem] top-0 left-0 right-0 bg-gradient-to-b from-transparent to-transparent/70`" />
      <div class="absolute max-w-7xl mx-auto mt-[25em] bottom-0 left-0 right-0 p-8 flex flex-col gap-1 justify-end">
        <div class="text-stone-50 text-6xl font-medium drop-shadow-md">{{ blog.title }}</div>
        <div class="mb-4 text-stone-50 text-xl font-normal drop-shadow-xl">{{ blog.subtitle }}</div>
        <NuxtLink :to="localePath(`/blogs/${blog.id}`)">
          <div class="btn btn-primary btn-wide shadow-md !font-medium text-lg"> {{ capitalizeFirstLetter($t('read_article')) }}
          </div>
        </NuxtLink>
      </div>
    </div>

  </TransitionRoot>
</template>

<script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { IBlog } from "~~/constants/data";

const { blog } = defineProps<{
  blog?: IBlog;
}>();
</script>

<style>
</style>
