<template>
  <input
    type="number"
    v-model="value"
    class="input input-sm input-bordered !outline-none"
  />
</template>

<script lang="ts" setup>
const emit = defineEmits(["onValueSet"]);

const { max, min, initialValue } = defineProps<{
  max: number;
  min: number;
  initialValue: number;
}>();

const value = ref<number>(initialValue);

watch(value, (v) => {
  const numberValue = Number(v);
  if (numberValue < min) {
    value.value = min;
    emit("onValueSet", min);
    return;
  }
  if (numberValue > max) {
    value.value = max;
    emit("onValueSet", max);
    return;
  }
  value.value = numberValue;
  emit("onValueSet", Number(v));
});
</script>

<style>
</style>