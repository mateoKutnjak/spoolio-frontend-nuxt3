<template>
  <NuxtLink :to="`/blogs/${item.id}`">
    <div class="w-64 card">
      <div class="card-body justify-between p-0">
        <div class="flex gap-3 items-center">
          <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-6">
              <span class="text-xs">{{ initials }}</span>
            </div>
          </div>
          <div class="font-bold text-gray-600">
            <div v-if="!hasAnyName">Anonymous</div>
            <div v-else>{{(item.author?.profile?.first_name || '')}} {{item.author?.profile?.last_name || ''}}</div>
          </div>
          <Icon
            name='lucide:circle'
            size="7"
          />
          <div class="text-gray-500">
            {{reformatDateShort(item?.created_at)}}
          </div>
        </div>
        <div class="pb-4">
          <h2 class="card-title text-lg text-gray-700 pb-3 font-black font-sans">{{item.title}}</h2>
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