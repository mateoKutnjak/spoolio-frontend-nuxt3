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
      :to="localePath(`/blogs/${item.id}`)"
      class="h-full"
    >
      <div class="h-full flex flex-col gap-2">
        <nuxt-img
          v-if="item?.picture"
          class="h-[15rem] w-full md:rounded-lg rounded-none object-cover"
          :src="item.picture"
        />
        <EmptyImagePlaceholder
          v-else
          class="h-[15rem] w-full rounded-lg"
        />
        <div class="h-full md:px-0 px-4 flex flex-col gap-2">
          <div class="mt-2 flex gap-3 items-center font-sans">
            <div class="avatar placeholder">
              <div class="bg-stone-300 text-neutral-content rounded-full w-10">
                <span class="text-base">{{ userProfileInitials(item.author?.profile) }}</span>
              </div>
            </div>
            <div class="text-base text-stone-500">{{ reformatDate(item.created_at) }}</div>
          </div>
          <div class="mt-1 text-2xl font-semibold text-stone-600">{{ item.title }}</div>
          <div class="text-stone-500 text-base">{{ item.subtitle }}</div>
          <div class="flex-1"></div>
          <div class="mt-3 card-actions justify-start">
            <BlogTag
              v-for="tag in item.tags"
              :key="tag.id"
              :tag="tag"
              @on-tag-clicked="emit('onTagClicked', tag)"
            />

          </div>
        </div>
      </div>
    </NuxtLink>
  </TransitionRoot>
</template>
      
      <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useBlogListStore } from "~~/stores/blogList";
import { useNotificationStore } from "~~/stores/notification";
import { TransitionRoot } from "@headlessui/vue";

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { item } = defineProps(["item"]);

const emit = defineEmits(["onTagClicked"]);

const { user } = storeToRefs(authStore);

const hasAnyName = computed(() => {
  return item.user?.profile?.first_name || item.user?.profile?.last_name;
});

const isCurrentyLoggedUser = computed(() => {
  if (item.user?.email && user.value?.email) {
    return item.user.email === user.value?.email;
  }
  return false;
});

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