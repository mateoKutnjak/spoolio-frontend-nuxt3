<template>
  <div class="container p-12">
    <div class="flex flex-col items-stretch justify-between gap-4 p-8">
      <div class="flex flex-col gap-4 justify-between ">
        <div class="flex gap-4 justify-between">
          <div class="mx-autoflex gap-4">
            <div class="avatar">
              <div class="w-14 h-14 rounded-full">
                <nuxt-img src="https://placeimg.com/192/192/people" />
              </div>
            </div>
            <div class="grid text-gray-700">
              <div>
                {{blog?.author.profile?.first_name || "first_name"}} {{blog?.author.profile?.last_name || "last_name"}}
              </div>
              <div>
                {{reformatDate(blog?.created_at) }}
              </div>
            </div>
          </div>
          <div>
            <NuxtLink :to="`/blogs/${id}/edit`">
              <div
                v-if="user?.is_staff && user?.id === blog?.author?.id || false"
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
        </div>
        <div class="pt-8 pb-8">
          <p class="prose text-3xl font-bold pb-2 pt-0">{{blog?.title}}</p>
          <p class="prose text-xl pt-0 ">{{blog?.subtitle}}</p>
        </div>
        <div class="pt-0 pb-0">
          <div class="alert alert-warning shadow-md">
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
          class="prose pt-0"
          v-html="$renderer.render((blog?.content || '') + '\n#### Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dicta ullam laboriosam, eaque consequuntur inventore, architecto earum vel nesciunt id ad. Totam dolore voluptate harum quos? Fugiat maiores earum quae.')"
        ></div>
      </div>

      <div class="divider h-0"></div>
      <div class="flex flex-col">
        <CommentCreateForm
          :blog-id="id"
          class="justify-end"
        />
      </div>
      <div class="mx-auto flex flex-col ">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Comments</h3>
        <div class="space-y-4">
          <div
            :key="comment.id"
            v-for="comment in getComments.comments"
          >
            <CommentListTile :comment="comment" />
          </div>
        </div>

      </div>
    </div>
  </div>

</template>
    
    <script lang="ts" setup>
import IBlogResponse, { useBlogStore } from "~/stores/blog";
import IUserResponse, { useAuthStore } from "~~/stores/auth";
import ICommentResponse from "~~/stores/comment";
import { useCommentListStore } from "~~/stores/commentList";

const { id } = useRoute().params;

const authStore = useAuthStore();
const blogStore = useBlogStore();
const commentListStore = useCommentListStore();

const blog = ref<IBlogResponse>();
const comments = ref<ICommentResponse[]>([]);
const user = ref<IUserResponse>();

const showInitLoading = ref<boolean>(true);

onMounted(() => {
  blogStore.fetchBlog(Number(id)).then((blog) => {
    showInitLoading.value = false;
  });
  commentListStore.fetchComments(Number(id));
});

const getBlog = computed(() => {
  blog.value = blogStore.getBlog;
  return blogStore.getBlog;
});

const getComments = computed(() => {
  return commentListStore.getComments;
});

const getUser = computed(() => {
  user.value = authStore.getUser;
  return authStore.getUser;
});

watch(getBlog, (value, old, invalidate) => {
  blog.value = value;
});

watch(getComments, (value, old, invalidate) => {
  comments.value = value.comments;
});

watch(getUser, (value, old, invalidate) => {
  user.value = value;
});
</script>
    
    <style>
</style>