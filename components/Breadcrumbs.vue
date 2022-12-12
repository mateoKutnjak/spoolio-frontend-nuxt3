<template>
  <div class="breadcrumbs">
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
const fullPath = useRoute().fullPath;

const crumbs = [{ name: "home", path: "/" }];

const pathChunks = fullPath.substring(1).split("/");

pathChunks.forEach((value, index) => {
  crumbs.push({
    name: value,
    path: crumbs[crumbs.length - 1].path + value + "/",
  });
});
</script>

<style>
</style>