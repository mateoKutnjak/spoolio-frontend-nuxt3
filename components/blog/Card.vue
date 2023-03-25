<template>
  <NuxtLink :to="`/blogs/${item.id}`">
    <div class="h-full card">

      <div
        v-if="item?.picture"
        class="h-56 flex bg-gray-300"
      >
        <nuxt-img
          :src="item.picture"
          style="object-fit: cover;"
        />
      </div>
      <div class="card-body justify-between px-0 py-4">
        <div class="flex justify-between items-center text-gray-800">
          <div class="flex gap-1 items-center text-lg">
            <div v-if="!hasAnyName">Anonymous</div>
            <div v-else>{{(item.user?.profile?.first_name || '')}} {{item.user?.profile?.last_name || ''}}</div>
            <Icon
              name="ci:dot-02-s"
              size="20"
              aria-hidden="true"
            />
            <div class="text-gray-500">
              {{reformatDate(item?.created_at)}}
            </div>
          </div>
        </div>
        <div>
          <div class="py-3 pb-4">
            <h2 class="card-title text-2xl text-gray-700 pb-1">{{item.title}}</h2>
            <p class="text-gray-600">{{item.subtitle}}</p>
          </div>

          <div class="card-actions justify-start items-center">
            <div class="font-bold link">Read More</div>
            <button
              class="btn btn-ghost btn-sm"
              @click.prevent="toggleLike"
            >
              <div class="flex gap-2 items-center">
                <Icon
                  :class="item.liked_by_me ? 'text-red-600' : ''"
                  :name="item.liked_by_me ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
                  size="20"
                  aria-hidden="true"
                />{{item.like_count || ''}}
              </div>
            </button>
            <button class="btn btn-ghost btn-sm">
              <div class="flex gap-2 items-center">
                <Icon
                  name="material-symbols:comment"
                  size="20"
                  aria-hidden="true"
                />{{item.comment_count || ''}}
              </div>
            </button>
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