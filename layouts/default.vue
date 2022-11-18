<template>
  <div>
    <header class="shadow-sm bg-white">
      <nav class="container mx-auto p-4 flex justify-between">
        <NuxtLink
          to="/"
          class="font-bold"
        >Spoolio</NuxtLink>
        <ul class="flex gap-4">
          <li>
            <NuxtLink
              to="/"
              class="btn"
            >Home</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/blogs"
              class="btn"
            >Blogs</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/job-order"
              class="btn"
            >Print</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/store"
              class="btn"
            >Shop</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/about"
              class="btn"
            >About</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <LoginForm />

    <div class="container mx-auto p-4">
      <slot />
    </div>
  </div>
</template>
  
  <style scoped>
.router-link-exact-active {
  color: #555555;
}
</style>