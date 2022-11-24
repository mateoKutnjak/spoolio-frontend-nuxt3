<template>
  <a>{{item.title}}</a>
</template>

<script lang="ts" setup>
const { item } = defineProps(["item"]); // props
</script>

<style>
</style>