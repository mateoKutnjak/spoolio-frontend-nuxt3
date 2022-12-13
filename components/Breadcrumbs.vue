<template>
  <div
    v-if="crumbs.length > 1"
    class="breadcrumbs"
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

  pathChunks.forEach((value: string, index: number) => {
    crumbs.value.push({
      name: value,
      path: crumbs.value[crumbs.value.length - 1].path + value,
    });
  });
}

watch(router.currentRoute, (value, oldValue, onInvalidated) => {
  const crumbs_copy = [{ name: "home", path: "/" }];

  if (value.fullPath !== "/") {
    const pathChunks = value.fullPath.substring(1).split("/");

    pathChunks.forEach((value: string, index: number) => {
      crumbs_copy.push({
        name: value,
        path: crumbs_copy[crumbs_copy.length - 1].path + value,
      });
    });
  }
  crumbs.value = [...crumbs_copy];
});
</script>

<style>
</style>