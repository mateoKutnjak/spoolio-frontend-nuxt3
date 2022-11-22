<template>
  <div class="card text-center">
    <p class="font-bold text-gray-500 m-4 truncate">{{blog.title}}</p>
    <NuxtLink :to="`/blogs/${blog.id}`">
      <button class="btn btn-accent">Button</button>
    </NuxtLink>
  </div>

</template>
  
  <script setup>
const { blog } = defineProps(["blog"]); // props
</script>
  
  <style>
</style>