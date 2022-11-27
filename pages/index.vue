<template>
  <p>Index</p>

  A normal text and a helper dropdown
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="btn btn-circle btn-ghost btn-xs text-info"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-4 h-4 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </label>
    <div
      tabindex="0"
      class="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
    >
      <div class="card-body">
        <h2 class="card-title">You needed more info?</h2>
        <p>Here is a description!</p>
      </div>
    </div>
  </div>
  <div class="alert alert-info shadow-lg">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current flex-shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>New software update available.</span>
    </div>
  </div>
  <article class="prose">
    <h1>Garlic bread with cheese: What the science tells us</h1>
    <p>For years parents have espoused the health benefits of eating garlic bread with cheese to their children, with the food earning such an iconic status in our culture that kids will often dress up as warm, cheesy loaf for Halloween.</p>
    <p>But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases springing up around the country.</p>
    <!-- ... -->
  </article>
</template>

<script lang="ts" setup>
</script>

<style>
</style>