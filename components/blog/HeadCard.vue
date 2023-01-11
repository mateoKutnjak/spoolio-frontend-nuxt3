<template>
  <NuxtLink :to="`/blogs/${blog.id}`">
    <div class="card lg:card-side rounded-sm shadow-md bg-white">
      <div
        v-if="blog?.picture"
        class="flex flex-col gap-3 items-center mx-auto bg-gray-300"
      >
        <nuxt-img
          :src="blog.picture"
          fit="contain"
        />
      </div>
      <div class="card-body flex flex-col justify-between">
        <div class="flex gap-1 justify-between items-center text-gray-500 text-lg">
          <div class="flex items-center">
            <div>
              {{blog?.author.profile?.first_name || "null"}} {{blog?.author.profile?.last_name || "null"}}
            </div>
            <Icon
              name="ci:dot-02-s"
              size="20"
              aria-hidden="true"
            />
            <div>
              {{reformatDate(blog?.created_at)}}
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
          <div class="pt-4 pb-6">
            <h2 class="card-title text-4xl text-gray-700 pb-3">{{blog.title}}</h2>
            <p class="text-gray-600">{{blog.subtitle}}</p>
          </div>
          <div class="card-actions justify-end ">
            <div class="card-actions gap-0 justify-end text-gray-700">

              <button
                class="btn btn-ghost"
                @click.prevent="toggleLike"
              >
                <div class="flex gap-2 items-center">
                  <Icon
                    :class="blog.liked_by_me ? 'text-red-600' : ''"
                    :name="blog.liked_by_me ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
                    size="20"
                    aria-hidden="true"
                  />{{blog.like_count || ''}}
                </div>
              </button>
              <button class="btn btn-ghost">
                <div class="flex gap-2 items-center">
                  <Icon
                    name="material-symbols:comment"
                    size="20"
                    aria-hidden="true"
                  />{{blog.comment_count || ''}}
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

const { blog } = defineProps(["blog"]);

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

function toggleLike() {
  if (!authStore.accessToken) {
    notificationStore.show("Log in to like", ToastLevel.info());
    return;
  }

  blogStore.toggleLike(authStore.accessToken!, blog.id);
}
</script>
    
    <style>
</style>