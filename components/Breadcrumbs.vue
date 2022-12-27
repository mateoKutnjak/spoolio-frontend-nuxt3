<template>
  <div
    v-if="crumbs.length > 1"
    class="breadcrumbs text-gray-800"
  >
    <ul>
      <li
        v-for="crumb in crumbs"
        :key="crumb.name"
      >
        <NuxtLink :to="crumb.path">
          {{crumb.name}}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

const currentRoute = router.currentRoute.value.fullPath;

const crumbs = ref([{ name: "home", path: "/" }]);

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
  }
  crumbs.value = [...crumbs_copy];
});
</script>

<style>
</style>