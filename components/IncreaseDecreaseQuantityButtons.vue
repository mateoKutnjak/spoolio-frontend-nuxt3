<template>
  <div class="flex gap-2 justify-start items-start">
    <button
      class="btn btn-sm btn-circle btn-ghost mt-2"
      @click="decreaseValue"
    >
      <Icon
        class="text-gray-500"
        name="ic:round-minus"
        size="24"
      />
    </button>
    <FormKit
      type="number"
      name="value"
      :min="min"
      :max="max"
      v-model="value"
      step="1"
      :validation="`between:${min},${max}`"
      validation-visibility="live"
      :classes="{
        inner: 'w-14',
        input: 'text-center',
      }"
    />
    <button
      class="btn btn-sm btn-circle btn-ghost mt-2"
      @click="increaseValue"
    >
      <Icon
        class="text-gray-500"
        name="ic:round-plus"
        size="24"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit2 = defineEmits(["onIncreaseValue", "onDecreaseValue", "onValueSet"]);

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
  emit2("onIncreaseValue", value.value);
}

function decreaseValue() {
  if (value.value - 1 < min) {
    value.value = min;
    return;
  }

  value.value -= 1;
  emit2("onDecreaseValue", value.value);
}

watch(value, (v) => {
  const numberValue = Number(v);

  if (numberValue < min) {
    value.value = min;
    emit2("onValueSet", min);
    return;
  }

  if (numberValue > max) {
    value.value = max;
    emit2("onValueSet", max);
    return;
  }

  value.value = numberValue;
  emit2("onValueSet", numberValue);
});
</script>

<style>
</style>