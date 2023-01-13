<template>
  <div class="container p-12">
    <div>
      <FormKit
        type="form"
        id="blog-edit-form"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Update"
        @submit="submitHandler"
        :actions="false"
      >
        <div class="flex flex-col gap-5">

          <div class="max-w-md">
            <FormKit
              type="text"
              name="title"
              label="Title"
              v-model="blogTitle"
              validation="required"
              validation-visibility="blur"
            />
          </div>
          <div>
            <FormKit
              type="text"
              name="subtitle"
              label="Subtitle"
              v-model="blogSubtitle"
              validation="required"
              validation-visibility="blur"
            />
          </div>
          <div class="grid grid-rows-1 grid-cols-1 md:grid-cols-2 gap-5">
            <textarea
              class="flex-1 source bg-gray-100 overflow-y h-screen p-4"
              v-model="blogContent"
            />

            <div>
              <div
                class="prose overflow-y-auto h-screen"
                v-html="$renderer.render(blogContent)"
              ></div>
            </div>
          </div>
          <div class="card-actions justify-center py-12">
            <FormKit
              type="submit"
              label="Update post"
            />
          </div>

        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBlogStore } from "~~/stores/blog";
import { IUserResponse, useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const blogStore = useBlogStore();
const notificationStore = useNotificationStore();

if (!authStore.getUser?.is_staff) {
  throw createError({ statusCode: 404, statusMessage: "Cannot edit this blog" });
}

const { id } = useRoute().params;

const blogTitle = ref<string>("");
const blogSubtitle = ref<string>("");
const blogContent = ref<string>("");
const user = ref<IUserResponse>();

const submitted = ref(false);
const showInitLoading = ref<boolean>(true);

onMounted(() => {
  blogStore.fetchBlog(Number(id)).then((blog) => {
    showInitLoading.value = false;

    blogTitle.value = blog.title;
    blogSubtitle.value = blog.subtitle;
    blogContent.value = blog.content;
  });
});

const getBlog = computed(() => {
  var blog = blogStore.getBlog;

  blogTitle.value = blog?.title || "";
  blogSubtitle.value = blog?.subtitle || "";
  blogContent.value = blog?.content || "";

  return blogStore.getBlog;
});

const getUser = computed(() => {
  user.value = authStore.getUser;
  return authStore.getUser;
});

watch(getBlog, (value, old, invalidate) => {
  blogTitle.value = value?.title || "";
  blogSubtitle.value = value?.subtitle || "";
  blogContent.value = value?.content || "";
});

watch(getUser, (value, old, invalidate) => {
  user.value = value;
});

const submitHandler = async () => {
  submitted.value = true;

  if (authStore.accessToken == null) {
    console.log("Access token not present (todo message)");
    return;
  }

  blogStore
    .patchBlog(
      authStore.accessToken,
      blogTitle.value,
      blogSubtitle.value,
      blogContent.value
    )
    .then(() => {
      notificationStore.show("Update saved", ToastLevel.info());
    })
    .catch((err) => {});
};
</script>

<style scoped>
.scrollable {
  overflow-y: scroll;
}
</style>