<template>
  <div>
    <FormKit
      type="form"
      id="quantity-form"
      submit-label="Save"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex gap-2">
        <FormKit
          type="number"
          v-model="quantity"
          @blur="onBlur"
          :validation="`required|min:${min}|max:${max}`"
          :validation-messages="{
            required: `This field is required`,
            max: `Allowed range is [${min}, ${max}]`,
            min: `Allowed range is [${min}, ${max}]`
          }"
          validation-visibility="live"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-right !outline-none rounded border-2 border-stone-400',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: '!m-0',
                message: '!m-0, !px-1'
              }"
        />
        <FormKit
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :classes="{input: 'btn btn-sm btn-block rounded-lg text-xs text-white', outer: '!m-0', }"
        />
      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onValueSet", "onUnfocus", "onSubmit"]);

const { max, min, initialValue } = defineProps<{
  max: number;
  min: number;
  initialValue: number;
}>();

const quantity = ref<number>(initialValue);

watch(quantity, (v) => {
  const numberValue = Number(v);
  if (numberValue < min) {
    quantity.value = min;
    emit("onValueSet", min);
    return;
  }
  if (numberValue > max) {
    quantity.value = max;
    emit("onValueSet", max);
    return;
  }
  quantity.value = numberValue;
  emit("onValueSet", Number(v));
});

function onBlur() {
  emit("onUnfocus");
}

function submitHandler() {
  emit("onSubmit", quantity.value);
}
</script>

<style>
[data-invalid] .formkit-input {
  border-color: red;
}

[data-errors] .formkit-input {
  border-color: red;
}
</style>