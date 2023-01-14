<template>
  <NuxtLink :to="`/blogs/${item.id}`">
    <div class="h-full card rounded-sm shadow-md bg-white">

      <div
        v-if="item?.picture"
        class="flex flex-col gap-3 items-center mx-auto bg-gray-300"
      >
        <nuxt-img
          :src="item.picture"
          fit="contain"
        />
      </div>
      <div class="card-body flex flex-col justify-between">
        <div class="flex justify-between text-gray-500">
          <div class="flex gap-1 items-center text-lg">
            <strong v-if="!hasAnyName">Anonymous</strong>
            <strong v-else>{{(item.user?.profile?.first_name || '')}} {{item.user?.profile?.last_name || ''}}</strong>
            <Icon
              name="ci:dot-02-s"
              size="20"
              aria-hidden="true"
            />
            <div>
              {{reformatDate(item?.created_at)}}
            </div>
          </div>
          <div
            class="dropdown dropdown-end"
            @click.prevent
          >
            <label
              tabindex="0"
              class="btn btn-ghost btn-circle"
            >
              <Icon
                name="mdi:dots-vertical"
                size="20"
                aria-hidden="true"
              />
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li><a>
                  <Icon
                    name="material-symbols:share"
                    size="20"
                    aria-hidden="true"
                  />Share
                </a></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="pt-2 pb-5">
            <h2 class="card-title text-2xl text-gray-700 pb-1">{{item.title}}</h2>
            <p class="text-gray-600">{{item.subtitle}}</p>
          </div>
          <div class="card-actions justify-end">
            <div class="card-actions gap-0 justify-end text-gray-700">

              <button
                class="btn btn-ghost"
                @click.prevent="toggleLike"
              >
                <div class="flex gap-2 items-center ">
                  <Icon
                    :class="item.liked_by_me ? 'text-red-600' : ''"
                    :name="item.liked_by_me ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
                    size="20"
                    aria-hidden="true"
                  />
                  {{item.like_count || ''}}
                </div>
              </button>
              <button class="btn btn-ghost">
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
    notificationStore.show("Log in to like", ToastLevel.info());
    return;
  }

  blogStore
    .toggleLike(authStore.accessToken!, item.id)
    .then((res) => {
      notificationStore.show("Content liked", ToastLevel.info());
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>
    
    <style>
</style>