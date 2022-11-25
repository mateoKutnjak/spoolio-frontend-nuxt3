<template>
  <div class="card md:card-side bg-base-100 shadow-md">
    <figure><img
        src="https://placeimg.com/300/300/arch"
        alt="Album"
      /></figure>
    <div class="card-body">
      <h2 class="card-title">{{blog.title}}</h2>
      <p>Click the button to listen on Spotiwhy app.</p>
      <div class="card-actions justify-end gap-3">
        <button
          v-if="isStaffUser"
          class="btn btn-outline gap-1"
        >
          <Icon
            name="material-symbols:edit-outline"
            size="20"
            aria-hidden="true"
          />Edit
        </button>
        <NuxtLink :to="`/blogs/${blog.id}`"><button class="btn btn-primary">Read more</button></NuxtLink>
      </div>
    </div>
  </div>

</template>
  
  <script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { blog } = defineProps(["blog"]); // props

const isStaffUser = ref<boolean>(false);

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