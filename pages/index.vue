<template>
  <div class="container">
    <div class="fixed top-0 right-0 left-0 h-[calc(100vh-4rem)] top-[4rem]">
      <div class="carousel carousel-vertical h-full">
        <div
          id="item1"
          class="carousel-item h-full"
        >
          <div class="hero bg-base-200">
            <div class="hero-content text-center">
              <div class="max-w-md">
                <h1 class="text-5xl font-bold">Hello there</h1>
                <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                <button class="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="item2"
          class="carousel-item h-full"
        >
          <div class="hero bg-base-200">
            <div class="hero-content flex-col lg:flex-row">
              <img
                src="https://placeimg.com/260/400/arch"
                class="max-w-sm rounded-lg shadow-2xl"
              />
              <div>
                <h1 class="text-5xl font-bold">Box Office News!</h1>
                <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                <button class="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="item3"
          class="carousel-item h-full"
        >
          <div class="hero bg-base-200">
            <div class="hero-content flex-col lg:flex-row-reverse">
              <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Login now!</h1>
                <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
              </div>
              <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div class="card-body">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="email"
                      class="input input-bordered"
                    />
                  </div>
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Password</span>
                    </label>
                    <input
                      type="text"
                      placeholder="password"
                      class="input input-bordered"
                    />
                    <label class="label">
                      <a
                        href="#"
                        class="label-text-alt link link-hover"
                      >Forgot password?</a>
                    </label>
                  </div>
                  <div class="form-control mt-6">
                    <button class="btn btn-primary">Login</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="item4"
          class="carousel-item h-full"
        >
          <div
            class="hero "
            style="background-image: url(https://placeimg.com/1000/800/arch);"
          >
            <div class="hero-overlay bg-opacity-60"></div>
            <div class="hero-content text-center text-neutral-content">
              <div class="max-w-md">
                <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
                <p class="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                <button class="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-0 left-0 bottom-0 flex justify-center p-12 gap-2">
        <a
          href="#item1"
          class="btn btn-circle btn-outline btn-sm border-2 border-gray-700 hover:border-gray-700"
        ></a>
        <a
          href="#item2"
          class="btn btn-circle btn-outline btn-sm border-2 border-gray-700 hover:border-gray-700"
        ></a>
        <a
          href="#item3"
          class="btn btn-circle btn-outline btn-sm border-2 border-gray-700 hover:border-gray-700"
        ></a>
        <a
          href="#item4"
          class="btn btn-circle btn-outline btn-sm border-2 border-gray-700 hover:border-gray-700"
        ></a>
      </div>
    </div>
    <!-- <div class="hero h-[calc(100vh-4rem)] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <button class="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script lang="ts" setup>
</script>

<style>
</style>