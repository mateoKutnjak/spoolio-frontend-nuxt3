<template>
  <div class="flex gap-1">

    <div
      class="btn btn-sm btn-circle btn-ghost"
      :class="quantity <= min ? 'text-gray-300' : 'text-gray-500'"
      @click="quantity <= min ? () => null : decreaseQuantity()"
    >
      <Icon
        name="ph:minus-bold"
        size="20"
      />
    </div>

    <div>
      <FormKit
        type="form"
        id="quantity-form"
        submit-label="Sign In"
        @submit="submitHandler"
        :actions="false"
      >
        <FormKit
          type="number"
          v-model="quantity"
          :validation="`required|min:${min}|max:${max}`"
          :validation-messages="{
            required: `This field is required`,
            max: `Allowed range is [${min}, ${max}]`,
            min: `Allowed range is [${min}, ${max}]`
          }"
          validation-visibility="live"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-right !outline-none rounded border border-stone-300 shadow',
                inner: '!p-0 m-0 border-none bg-white',
                outer: '!m-0',
                message: '!m-0, !px-1'
              }"
        />
        <FormKit
          v-if="!emitLive && updated"
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :classes="{input: 'btn btn-sm btn-block mt-2 rounded-lg text-xs', outer: '!m-0', }"
        />
      </FormKit>
    </div>

    <div
      class="btn btn-sm btn-circle btn-ghost"
      :class="quantity >= max ? 'text-gray-300' : 'text-gray-500'"
      @click="quantity >= max ? () => null : increaseQuantity()"
    >
      <Icon
        name="ph:plus-bold"
        size="20"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onIncreaseValue", "onDecreaseValue", "onValueSet"]);

const { max, min, initialValue, emitLive } = defineProps<{
  max: number;
  min: number;
  initialValue: number;
  emitLive?: boolean;
}>();

const quantity = ref<number>(initialValue);
const updated = ref(false);

function increaseQuantity() {
  if (quantity.value + 1 > max) {
    quantity.value = max;
    return;
  }

  quantity.value += 1;

  if (emitLive) {
    emit("onIncreaseValue", quantity.value);
  }
}

function decreaseQuantity() {
  if (quantity.value - 1 < min) {
    quantity.value = min;
    return;
  }

  quantity.value -= 1;

  if (emitLive) {
    emit("onDecreaseValue", quantity.value);
  }
}

function submitHandler() {
  if (!emitLive) {
    updated.value = false;
    emit("onValueSet", quantity.value);
  }
}

watch(quantity, (v) => {
  const numberValue = Number(v);

  updated.value = true;

  if (numberValue < min) {
    quantity.value = min;

    if (emitLive) {
      emit("onValueSet", min);
    }
    return;
  }
  if (numberValue > max) {
    quantity.value = max;

    if (emitLive) {
      emit("onValueSet", max);
    }
    return;
  }
  quantity.value = numberValue;

  if (emitLive) {
    emit("onValueSet", Number(v));
  }
});
</script>

<style>
[data-invalid] .formkit-input {
  border-color: red;
}

[data-errors] .formkit-input {
  border-color: red;
}
</style>