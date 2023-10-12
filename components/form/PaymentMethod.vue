<template>
    <div
      class="bg-white btn btn-block btn-ghost btn-lg no-animation rounded-md border border-stone-400/80 text-stone-500"
      @click="onSubmit"
    >
      <div
        v-if="payment_active"
        class="w-full flex gap-6 font-normal items-center"
      >
        <Icon
          name="ph:money"
          size="30"
        />
        <div class="font-bold text-lg">{{payment_card}}</div>
        <div class="font-bold text-md">**** **** **** {{payment_num}}</div>
        <div class="flex-1"></div>
        <Icon
          name="ph:note-pencil-bold"
          size="25"
        />
      </div>
      <div v-else>
        <div class="flex gap-2 items-center italic font-bold text-gray-500">
          <Icon
            name="ph:plus-square"
            size="20"
          />
          {{ capitalizeOnlyFirstLetter($t('choose') + ' ' + $t('payment_method')) }}
        </div>
      </div>
    </div>
  </template>
    
<script lang="ts" setup>

const props = defineProps({
  payment_num: String,
  payment_card: String
});

const payment_active = ref(false);

const payment_num = computed(() => {
  if (props.payment_num){
    return props.payment_num;
  }
  return '';
});
const payment_card = computed(() => {
  if (props.payment_card){
    return props.payment_card.toUpperCase();
  }
  return '';
});

watch(payment_num, (value) => {
  console.log("Child payment change: %s", value);
  if (value.length > 0){
    payment_active.value = true;
  }else{
    payment_active.value = false;
  }
});

function onSubmit() {
    
}
</script>

<style>
</style>