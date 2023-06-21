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
        <div class="md:px-0 px-4 flex flex-col gap-2">
          <div class="text-sm text-stone-600">{{ reformatDateShort(item.created_at) }}</div>
          <div class="text-2xl font-bold text-stone-600">{{ item.title }}</div>
          <div class="text-stone-600 text-sm">{{ item.subtitle }}</div>
          <div class="flex-1"></div>
          <div class="mt-3 card-actions justify-start">
            <div
              v-for="tag in item.tags"
              :key="tag.id"
              class="btn btn-outline btn-xs rounded-sm text-stone-700"
              @click.prevent="emit('onTagClicked', tag)"
            >{{ tag.name }}</div>
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