<template>
  <div class="form-control rounded-full">
    <div class="flex border border-gray-400 bg-white rounded-full">
      <input
        type="text"
        placeholder="Search…"
        class="input btn-block !outline-none bg-transparent"
        v-model="input"
      />
      <button class="btn btn-ghost rounded-full">
        <Icon
          class="text-[#888888]"
          name="lucide:search"
          size="25"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["submit-search-phrase"]);

const { placeholder } = defineProps(["placeholder"]);

const input = ref("");

watch([input], (value, oldValue, onInvalidate) => {
  emit("submit-search-phrase", value);
});
</script>

<style>
</style>