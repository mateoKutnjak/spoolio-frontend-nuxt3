<template>
  <NuxtLink :to="`/blogs/${blog.id}`">
    <div class="card lg:card-side gap-6">
      <div
        v-if="blog?.picture"
        class="w-96 flex flex-col gap-3 items-center mx-auto bg-gray-300"
      >
        <nuxt-img
          :src="blog.picture"
          style="object-fit: cover;"
        />
      </div>
      <div class="card-body justify-between p-0">
        <div class="flex gap-1 justify-between items-center text-gray-800">
          <div class="flex items-center">
            <div v-if="!hasAnyName">Anonymous</div>
            <div v-else>{{(blog.author?.profile?.first_name || '')}} {{blog.author?.profile?.last_name || ''}}</div>
            <Icon
              name="ci:dot-02-s"
              size="20"
              aria-hidden="true"
            />
            <div class="text-gray-500">
              {{reformatDate(blog?.created_at)}}
            </div>
          </div>
        </div>
        <div>
          <div class="py-6">
            <h2 class="card-title text-4xl text-gray-700 pb-3">{{blog.title}}</h2>
            <p class="text-gray-600">{{blog.subtitle}}</p>
          </div>
          <div class="card-actions justify-start items-center">
            <div class="font-bold link">Read More</div>
            <button
              class="btn btn-ghost btn-sm"
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
            <button class="btn btn-ghost btn-sm">
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
  </NuxtLink>

</template>
    
    <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useBlogListStore } from "~~/stores/blogList";
import { useNotificationStore } from "~~/stores/notification";

const { blog } = defineProps(["blog"]);

const authStore = useAuthStore();
const blogStore = useBlogListStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const hasAnyName = computed(() => {
  return blog.author?.profile?.first_name || blog.author?.profile?.last_name;
});

function toggleLike() {
  if (!authStore.accessToken) {
    notificationStore.show("Log in to like", ToastLevelType.info);
    return;
  }

  blogStore
    .toggleLike(authStore.accessToken!, blog.id)
    .then((res) => {
      notificationStore.show("Content liked", ToastLevelType.info);
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>
    
    <style>
</style>