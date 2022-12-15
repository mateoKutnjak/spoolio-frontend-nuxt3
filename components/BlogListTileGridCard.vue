<template>
  <NuxtLink :to="`/blogs/${item.id}`">
    <div class="card rounded-sm shadow-md bg-white">
      <img
        src="https://api.lorem.space/image/album?w=500&h=400"
        alt="Album"
      >
      <div class="card-body flex flex-col justify-between">
        <div class="flex justify-between text-gray-500">
          <div class="flex gap-1 items-center text-lg">
            <div>
              {{item?.author.profile?.first_name || "null"}} {{item?.author.profile?.last_name || "null"}}
            </div>
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
              class="btn btn-ghost btn-square btn-sm"
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
          <div class="pt-5 pb-5">
            <h2 class="card-title text-2xl pb-1">{{item.title}}</h2>
            <p class="text-gray-600">{{item.subtitle}}</p>
          </div>
          <div class="card-actions justify-end">
            <div class="card-actions gap-0 justify-end text-gray-700">

              <button
                class="btn btn-ghost btn-sm"
                @click.prevent="toggleLike"
              >
                <div class="flex gap-2 items-center ">
                  <Icon
                    class="text-red-600"
                    :name="item.liked_by_me ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
                    size="20"
                    aria-hidden="true"
                  />
                  {{item.like_count || ''}}
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
    </div>
  </NuxtLink>
</template>
  
  <script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";
import { useBlogListStore } from "~~/stores/blogList";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { item } = defineProps(["item"]);

function toggleLike() {
  if (!authStore.accessToken) {
    notificationStore.show("Log in to like", ToastLevel.info());
    return;
  }

  blogStore.toggleLike(authStore.accessToken!, item.id);
}
</script>
  
  <style>
</style>