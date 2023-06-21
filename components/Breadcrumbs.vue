<template>
  <div class="breadcrumbs text-gray-600 font-semibold">
    <ul>
      <li
        v-for="crumb in crumbs"
        :key="crumb.name"
      >
        <NuxtLink :to="localePath('crumb.path')">
          {{ capitalizeOnlyFirstLetter($t(crumb.name)) }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

const currentRoute = router.currentRoute.value.fullPath;

const crumbs = ref([{ name: "home", path: "/" }]);
const isShown = ref<boolean>(false);

if (currentRoute !== "/") {
  const pathChunks = currentRoute.substring(1).split("/");

  pathChunks.forEach((chunk: string, index: number) => {
    if (chunk) {
      crumbs.value.push({
        name: chunk,
        path:
          crumbs.value[crumbs.value.length - 1].path +
          chunk +
          (chunk.endsWith("/") ? "" : "/"),
      });
    }
  });
}

watch(router.currentRoute, (value, oldValue, onInvalidated) => {
  const crumbs_copy = [{ name: "home", path: "/" }];

  if (value.fullPath !== "/") {
    const pathChunks = value.fullPath.substring(1).split("/");

    pathChunks.forEach((chunk: string, index: number) => {
      if (chunk) {
        crumbs_copy.push({
          name: chunk,
          path:
            crumbs_copy[crumbs_copy.length - 1].path +
            chunk +
            (chunk.endsWith("/") ? "" : "/"),
        });
      }
    });
    isShown.value = true;
  } else {
    isShown.value = false;
  }

  if (value.fullPath.startsWith("/#")) {
    isShown.value = false;
  }

  crumbs.value = [...crumbs_copy];
});
</script>

<style>
</style>