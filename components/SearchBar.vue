<template>
  <FormKit
    type="search"
    placeholder="Search..."
    label="Search"
    value="Apple Cider"
    v-model="input"
  />
</template>

<script setup>
const emit = defineEmits(["submit-search-phrase"]);

const { placeholder } = defineProps(["placeholder"]);

const input = ref("");

watch([input], (value, oldValue, onInvalidate) => {
  emit("submit-search-phrase", value);
});
</script>

<style>
</style>