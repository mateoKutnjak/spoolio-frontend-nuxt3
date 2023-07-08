<template>
  <div class="container mx-auto font-['Poppins']">
    <div class="flex flex-col items-stretch justify-between gap-4 p-8">
      <div class="flex flex-col gap-4 justify-between ">
        <div class="flex gap-4 justify-between">
          <div class="mt-2 flex gap-3 items-center font-sans">
            <div class="avatar placeholder">
              <div class="bg-stone-300 text-neutral-content rounded-full w-10">
                <span class="text-base">{{ userProfileInitials(blog?.author?.profile) }}</span>
              </div>
            </div>
            <div class="text-lg text-stone-500">{{ reformatDate(blog?.created_at) }}</div>
          </div>
          <div>
            <NuxtLink :to="localePath(`/blogs/${id}/edit`)">
              <div
                v-if="user?.is_staff && user?.id === blog?.author?.id || false"
                class="btn btn-outline gap-1"
              >
                <Icon
                  name="ph:note-pencil"
                  size="20"
                  aria-hidden="true"
                />{{ capitalizeOnlyFirstLetter($t('edit')) }}
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="py-2">
          <p class="prose text-3xl font-semibold pb-2 pt-0">{{blog?.title}}</p>
          <p class="prose text-stone-500 text-lg pt-0 ">{{blog?.subtitle}}</p>
        </div>
        <div
          v-if="blog?.picture"
          class="flex flex-col gap-3 items-center mx-auto bg-gray-300 "
        >
          <nuxt-img
            :src="blog.picture"
            style="object-fit: cover;"
          />
        </div>

        <div
          class="prose text-lg py-2"
          v-html="$renderer.render(blog?.content || '')"
        ></div>
      </div>

      <!-- <div class="divider h-0"></div> -->

      <!-- <CommentList
        :object-id="objectId"
        :content-type="CONTENT_TYPE_BLOG"
      /> -->
    </div>
  </div>

</template>
    
    <script lang="ts" setup>
import { useBlogStore } from "~/stores/blog";
import { CONTENT_TYPE_BLOG } from "~~/constants/constants";
import { IBlog, IUser } from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";

const { id } = useRoute().params;
const objectId = Number(id);

const authStore = useAuthStore();
const blogStore = useBlogStore();
const notificationStore = useNotificationStore();

const blog = ref<IBlog>();
const user = ref<IUser>();

const showInitLoading = ref<boolean>(true);

onMounted(() => {
  blogStore
    .fetchBlog(Number(id))
    .then((blog) => {
      showInitLoading.value = false;
    })
    .catch((err) => notificationStore.showFetchError(err));
});

const getBlog = computed(() => {
  blog.value = blogStore.getBlog;
  return blogStore.getBlog;
});

const getUser = computed(() => {
  user.value = authStore.getUser;
  return authStore.getUser;
});

const hasAnyName = computed(() => {
  return (
    getBlog.value?.author?.profile?.first_name ||
    getBlog.value?.author?.profile?.last_name
  );
});

watch(getBlog, (value, old, invalidate) => {
  blog.value = value;
});

watch(getUser, (value, old, invalidate) => {
  user.value = value;
});
</script>
    
    <style>
</style>