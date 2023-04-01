<template>
  <div class="flex gap-2 justify-start items-center">
    <div
      class="btn btn-sm btn-circle btn-ghost"
      :class="value <= min ? 'text-gray-300' : 'text-gray-500'"
      @click="value <= min ? () => null : decreaseValue()"
    >
      <Icon
        name="lucide:minus"
        size="24"
      />
    </div>
    <input
      type="number"
      v-model="value"
      class="input input-bordered w-20 !outline-none"
    />
    <button
      class="btn btn-sm btn-circle btn-ghost"
      :class="value >= max ? 'text-gray-300' : 'text-gray-500'"
      @click="value >= max ? () => null : increaseValue()"
    >
      <Icon
        name="lucide:plus"
        size="24"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onIncreaseValue", "onDecreaseValue", "onValueSet"]);

const { max, min, initialValue } = defineProps<{
  max: number;
  min: number;
  initialValue: number;
}>();

const value = ref<number>(initialValue);

function increaseValue() {
  if (value.value + 1 > max) {
    value.value = max;
    return;
  }

  value.value += 1;
  emit("onIncreaseValue", value.value);
}

function decreaseValue() {
  if (value.value - 1 < min) {
    value.value = min;
    return;
  }

  value.value -= 1;
  emit("onDecreaseValue", value.value);
}

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