<template>
  <div class="card lg:card-side bg-base-100 shadow-xl">
    <figure><img
        src="https://placeimg.com/400/400/arch"
        alt="Album"
      /></figure>
    <div class="card-body">
      <h2 class="card-title">{{blog.title}}</h2>
      <p>Click the button to listen on Spotiwhy app.</p>
      <div class="card-actions justify-end gap-3">
        <button class="btn btn-outline gap-1">
          <Icon
            name="material-symbols:edit-outline"
            size="20"
            aria-hidden="true"
          />Edit
        </button>
        <button class="btn btn-primary">Read more</button>
      </div>
    </div>
  </div>

</template>
  
  <script setup>
const { blog } = defineProps(["blog"]); // props
</script>
  
  <style>
</style>