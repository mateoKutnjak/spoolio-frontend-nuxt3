<template>
  <NuxtLink :to="`/blogs/${item.id}`">
    <div class="h-full card">

      <div
        v-if="item?.picture"
        class="h-56 flex bg-gray-300 rounded-2xl"
      >
        <nuxt-img
          class="rounded-2xl"
          :src="item.picture"
          style="object-fit: cover;"
        />
      </div>
      <div class="card-body justify-between p-0 pt-4">
        <div class="-ml-3 flex">
          <div
            v-for="tag in item.tags"
            :key="tag.name"
            class="btn btn-sm btn-ghost btn-info text-info rounded-full"
          >{{ tag.name }}</div>
        </div>
        <div class="py-6">
          <h2 class="card-title text-2xl text-gray-700 pb-3 font-black font-sans">{{item.title}}</h2>
          <p class="text-gray-600 font-sans">{{item.subtitle}}</p>
        </div>
        <div class="flex gap-4 items-center font-sans">
          <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
              <span class="text-2xl">{{ initials }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="font-bold text-gray-600">
              <div v-if="!hasAnyName">Anonymous</div>
              <div v-else>{{(item.author?.profile?.first_name || '')}} {{item.author?.profile?.last_name || ''}}</div>
            </div>
            <div class="text-gray-500">
              {{reformatDate(item?.created_at)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
    
    <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useBlogListStore } from "~~/stores/blogList";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { item } = defineProps(["item"]);

const { user } = storeToRefs(authStore);

const hasAnyName = computed(() => {
  return item.user?.profile?.first_name || item.user?.profile?.last_name;
});

const initials = computed(() => {
  const result =
    (item.author?.profile?.first_name
      ? item.author.profile.first_name[0]
      : "") +
    (item.author?.profile?.last_name ? item.author.profile.last_name[0] : "");

  if (result) return result;
  return "A";
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