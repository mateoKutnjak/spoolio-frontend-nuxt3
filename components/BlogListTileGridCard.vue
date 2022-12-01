<template>
  <NuxtLink :to="`/blogs/${blog.id}`">
    <div class="card rounded-sm shadow-md">
      <img
        src="https://api.lorem.space/image/album?w=500&h=400"
        alt="Album"
      >
      <div class="card-body flex flex-col justify-between">
        <div class="flex justify-between text-gray-500">
          <div class="flex gap-1 items-center text-lg">
            <div>
              {{blog?.author.profile?.first_name || "null"}} {{blog?.author.profile?.last_name || "null"}}
            </div>
            <Icon
              name="ci:dot-02-s"
              size="20"
              aria-hidden="true"
            />
            <div>
              {{reformatDate(blog?.created_at)}}
            </div>
          </div>
          <div
            class="dropdown dropdown-end"
            @click.prevent
          >
            <label
              tabindex="0"
              class="btn btn-ghost btn-square btn-sm"
            >
              <Icon
                name="mdi:dots-vertical"
                size="20"
                aria-hidden="true"
              />
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li><a>
                  <Icon
                    name="material-symbols:share"
                    size="20"
                    aria-hidden="true"
                  />Share
                </a></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="pt-5 pb-5">
            <h2 class="card-title text-2xl pb-1">New album is released!</h2>
            <p class="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quasi odio. Nostrum nemo beatae fuga nihil, pariatur atque saepe sapiente! Illo soluta accusantium unde ipsam doloribus. Quibusdam officia possimus nesciunt?</p>
          </div>
          <div class="card-actions justify-end">
            <div class="card-actions gap-0 justify-end text-gray-700">

              <button class="btn btn-ghost btn-sm">
                <div class="flex gap-2 items-center">
                  <Icon
                    name="mdi:cards-heart-outline"
                    size="20"
                    aria-hidden="true"
                  />1234
                </div>
              </button>
              <button class="btn btn-ghost btn-sm">
                <div class="flex gap-2 items-center">
                  <Icon
                    name="ic:baseline-remove-red-eye"
                    size="20"
                    aria-hidden="true"
                  />98765
                </div>
              </button>
              <button class="btn btn-ghost btn-sm">
                <div class="flex gap-2 items-center">
                  <Icon
                    name="material-symbols:comment"
                    size="20"
                    aria-hidden="true"
                  />98765
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
  
  <script lang="ts" setup>
const { blog } = defineProps(["blog"]); // props
</script>
  
  <style>
</style>