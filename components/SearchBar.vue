<template>
  <div class="form-control">
    <div class="input-group">
      <input
        type="text"
        placeholder="Search…"
        class="input input-bordered"
      />
      <button class="btn btn-primary">
        <Icon
          name="ion:ios-search"
          size="25"
        />
      </button>
    </div>
  </div>
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