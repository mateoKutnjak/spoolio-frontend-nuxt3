<template>

  <TransitionRoot
    v-if="item"
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
    <NuxtLink
      :to="localePath(`/faq/${item.id}`)"
      class="h-full"
    >
      <div class="h-full flex flex-col gap-2">
        <div class="h-[15rem]">
          <nuxt-img
            v-if="item?.picture"
            class="h-[15rem] w-full md:rounded-lg rounded-none object-cover"
            :src="item.picture"
          />
          <EmptyImagePlaceholder
            v-else
            class="h-[15rem] w-full rounded-lg"
          />
        </div>

        <div class="h-full md:px-0 px-4 flex flex-col">
          <div class="mt-1 text-2xl font-bold text-stone-600">{{ $t(item.name).toUpperCase() }}</div>
          <div class="text-stone-500 text-lg">{{ capitalizeOnlyFirstLetter($t(item.description)) }}</div>
          <div class="flex-1"></div>
          <ButtonFindOutMore
            class="self-end btn-sm"
            :to="localePath(`/faq/${item.id}`)"
          />
        </div>
      </div>
    </NuxtLink>
  </TransitionRoot>
</template>
      
      <script lang="ts" setup>
import { TransitionRoot } from "@headlessui/vue";
import { IFaqCategory } from "~~/constants/data";

const { item } = defineProps<{
  item: IFaqCategory;
}>();
</script>
      
<style>
</style>