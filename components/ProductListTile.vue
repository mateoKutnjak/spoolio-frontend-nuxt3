<template>
  <div class="card lg:card-side bg-base-100 shadow-xl">
    <figure><img
        src="https://placeimg.com/400/400/arch"
        alt="Album"
      /></figure>
    <div class="card-body">
      <h2 class="card-title">{{product.title}}</h2>
      <p>Click the button to listen on Spotiwhy app.</p>
      <div class="card-actions justify-end">
        <NuxtLink :to="`/store/${product.id}/`">
          <button class="btn btn-primary">Read more</button>
        </NuxtLink>
      </div>
    </div>
  </div>

</template>
  
  <script setup>
const { product } = defineProps(["product"]); // props
</script>
  
  <style>
</style>