<template>
  <div>
    <div class="flex items-center gap-4 p-8">
      <div class="avatar">
        <div class="w-14 h-14 rounded-full">
          <img src="https://placeimg.com/192/192/people" />
        </div>
      </div>
      <div class="grid">
        <div>
          {{getBlog?.author.profile?.first_name || "first_name"}} {{getBlog?.author.profile?.last_name || "last_name"}}
        </div>
        <div>
          {{getBlog?.created_at}}
        </div>
      </div>
      <div class="flex-1" />
      <div
        v-if="isStaffUser"
        class="btn btn-outline gap-1"
      >
        <Icon
          name="material-symbols:edit-outline"
          size="20"
          aria-hidden="true"
        />Edit
      </div>
    </div>
    <p class="prose text-3xl font-bold p-8 pb-2 pt-2">Blog</p>
    <p class="prose text-xl p-8 pt-2">Blog</p>
    <div
      class="max-w-2xl mx-auto p-4 prose"
      v-html="$markdown.render(blogContent)"
    ></div>
  </div>

</template>
  
  <script lang="ts" setup>
import { useBlogStore } from "~/stores/blog";
import { useAuthStore } from "~~/stores/auth";

const { $markdown } = useNuxtApp();

const { id } = useRoute().params;

const authStore = useAuthStore();
const blogStore = useBlogStore();

const blogContent = ref<string>("");

const isStaffUser = ref<boolean>(false);
const showInitLoading = ref<boolean>(true);

console.log(id);

onMounted(() => {
  blogStore.fetchBlog(Number(id)).then((blog) => {
    showInitLoading.value = false;
    console.log(blog);

    blogContent.value = blog.content;
  });
});

const getBlog = computed(() => {
  return blogStore.getBlog;
});

const getUser = computed(() => {
  isStaffUser.value = authStore.getUser?.is_staff || false;
  return authStore.getUser;
});

watch(getUser, (value, old, invalidate) => {
  isStaffUser.value = value?.is_staff || false;
});
</script>
  
  <style>
</style>