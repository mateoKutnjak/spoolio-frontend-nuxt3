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
    <NuxtLink :to="localePath(`/blogs/${item.id}`)">
      <div class="md:px-0 px-4 flex flex-col gap-2">
        <div class="text-sm text-stone-600">{{ reformatDateShort(item.created_at) }}</div>
        <div class="text-xl font-bold text-stone-600">{{ item.title }}</div>
        <div class="mb-2 text-stone-600 text-sm">{{ item.subtitle }}</div>
        <div class="flex gap-1">
          <div
            v-for="tag in item.tags"
            :key="tag.id"
            class="btn btn-outline btn-xs rounded-sm text-stone-700"
            @click.prevent="emit('onTagClicked', tag)"
          >{{ tag.name }}</div>
        </div>
      </div>
    </NuxtLink>
  </TransitionRoot>
</template>
      
      <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { IBlog } from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useBlogListStore } from "~~/stores/blogList";
import { useNotificationStore } from "~~/stores/notification";
import { TransitionRoot } from "@headlessui/vue";

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { item } = defineProps<{ item: IBlog }>();

const emit = defineEmits(["onTagClicked"]);

const { user } = storeToRefs(authStore);

function toggleLike() {
  if (!authStore.accessToken) {
    notificationStore.show("Log in to like", ToastLevelType.info);
    return;
  }

  blogStore
    .toggleLike(authStore.accessToken!, item.id)
    .then((res) => {
      notificationStore.show("Content liked", ToastLevelType.info);
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>
      
      <style>
</style>