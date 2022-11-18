<template>
  <div class="card text-center">
    <img
      :src="blog.image"
      alt="product thumb"
      class="thumb"
    >
    <p class="font-bold text-gray-500 m-4 truncate">{{blog.title}}</p>
    <NuxtLink :to="`/products/${blog.id}`">
      <p class="btn my-4">View Details</p>
    </NuxtLink>
  </div>

</template>
  
  <script setup>
const { blog } = defineProps(["blog"]); // props
</script>
  
  <style>
</style>