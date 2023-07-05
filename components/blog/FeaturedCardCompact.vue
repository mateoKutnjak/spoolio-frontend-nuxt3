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
        <div class="mt-1 flex gap-3 items-center font-sans">
          <div class="avatar placeholder">
            <div class="bg-stone-300 text-neutral-content rounded-full w-8">
              <span class="text-sm">{{ userProfileInitials(item.author?.profile) }}</span>
            </div>
          </div>
          <div class="text-sm text-stone-500">{{ reformatDate(item.created_at) }}</div>
        </div>
        <div class="font-bold text-stone-600">{{ item.title }}</div>
        <div class="mb-2 text-stone-600 text-sm">{{ item.subtitle }}</div>
        <div class="flex gap-1">
          <BlogTag
            v-for="tag in item.tags"
            :key="tag.id"
            :tag="tag"
            @on-tag-clicked="emit('onTagClicked', tag)"
          />
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