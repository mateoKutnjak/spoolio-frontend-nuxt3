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
          {{blog?.author.profile?.first_name || "first_name"}} {{blog?.author.profile?.last_name || "last_name"}}
        </div>
        <div>
          {{blog?.created_at}}
        </div>
      </div>
      <div class="flex-1" />
      <NuxtLink :to="`/blogs/${id}/edit`">
        <div
          v-if="user?.is_staff || false"
          class="btn btn-outline gap-1"
        >
          <Icon
            name="material-symbols:edit-outline"
            size="20"
            aria-hidden="true"
          />Edit
        </div>
      </NuxtLink>
    </div>
    <p class="prose text-3xl font-bold p-8 pb-2 pt-0">{{blog?.title}}</p>
    <p class="prose text-xl p-8 pt-0">{{blog?.subtitle}}</p>
    <div class="p-8 pt-0 pb-0">
      <div class="alert alert-warning shadow-lg">
        <div>
          <Icon
            name="eos-icons:bubble-loading"
            size="30"
            aria-hidden="true"
          />
          <span>TODO: insert picture here</span>
        </div>
      </div>
    </div>
    <div
      class="max-w-2xl mx-auto prose pt-8"
      v-html="$renderer.render(blog?.content || '')"
    ></div>
  </div>

</template>
    
    <script lang="ts" setup>
import IBlogResponse, { useBlogStore } from "~/stores/blog";
import IUserResponse, { useAuthStore } from "~~/stores/auth";

const { $markdown } = useNuxtApp();

const { id } = useRoute().params;

const authStore = useAuthStore();
const blogStore = useBlogStore();

const blog = ref<IBlogResponse>();
const user = ref<IUserResponse>();

const showInitLoading = ref<boolean>(true);

console.log(id);

onMounted(() => {
  blogStore.fetchBlog(Number(id)).then((blog) => {
    showInitLoading.value = false;
  });
});

const getBlog = computed(() => {
  blog.value = blogStore.getBlog;
  return blogStore.getBlog;
});

const getUser = computed(() => {
  user.value = authStore.getUser;
  // isStaffUser.value = authStore.getUser?.is_staff || false;
  return authStore.getUser;
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