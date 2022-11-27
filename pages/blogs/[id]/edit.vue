<template>
  <FormKit
    type="form"
    id="blog-edit-form"
    :form-class="submitted ? 'hide' : 'show'"
    submit-label="Update"
    @submit="submitHandler"
    :actions="false"
  >
    <div class="card-body justify-center flex flex-col">

      <FormKit
        type="text"
        name="title"
        label="Title"
        v-model="title"
        validation="required"
        validation-visibility="blur"
      />
      <FormKit
        type="text"
        name="subtitle"
        label="Subtitle"
        v-model="subtitle"
        validation="required"
        validation-visibility="blur"
      />
      <div class="grid grid-rows-1 grid-cols-1 md:grid-cols-2 gap-5">
        <!-- <FormKit
          class="flex-1 source bg-gray-100"
          v-show="false"
          type="textarea"
          name="content"
          label="Content"
          v-model="content"
          validation="required"
          validation-visibility="blur"
        /> -->
        <div class="flex">
          <textarea
            class="flex-1 source bg-gray-100 overflow-y h-screen"
            v-model="content"
          />
        </div>

        <div>
          <div
            class="prose overflow-y-auto h-screen"
            v-html="$renderer.render(content)"
          ></div>
        </div>
      </div>
      <div class="card-actions justify-end">
        <FormKit
          type="submit"
          label="Update post"
        />
      </div>

    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { useBlogStore } from "~~/stores/blog";
import { useAuthStore } from "~~/stores/auth";
const { $markdown } = useNuxtApp();

const authStore = useAuthStore();
const blogStore = useBlogStore();

const { id } = useRoute().params;

const title = ref<string>("");
const subtitle = ref<string>("");
const content = ref<string>("");

const submitted = ref(false);
const showInitLoading = ref<boolean>(true);

onMounted(() => {
  blogStore.fetchBlog(Number(id)).then((blog) => {
    showInitLoading.value = false;
    console.log(blog);

    title.value = blog.title;
    subtitle.value = blog.subtitle;
    content.value = blog.content;
  });
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
      title.value,
      subtitle.value,
      content.value
    )
    .then(() => {
      // todo check if navigateto dest the job
      // navigateTo(`/blogs/${id}/`);
    })
    .catch((err) => {});
};
</script>

<style scoped>
.container {
  display: inline;
}
.container :nth-last-child(1) {
  display: inline;
}

.scrollable {
  overflow-y: scroll;
}
</style>