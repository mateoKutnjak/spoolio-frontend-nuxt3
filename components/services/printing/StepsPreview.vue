<template>
  <ul class="steps steps-vertical w-full md:steps-horizontal pt-1 text-stone-600">
    <li
      v-for="step, index in steps"
      :key="step"
      class="step after:!hidden"
      :class="`${currentStepIndex >= index ? 'step-primary' : ''}`"
    >
      <div class="uppercase pl-4 md:pl-0 text-xl font-medium">{{ step }}</div>
      <div
        class="col-start-1 row-start-1 z-[1] btn btn-circle text-stone-500"
        :class="`${currentStepIndex >= index ? 'btn-primary' : ''}`"
      >
        <Icon
          v-if="iconNames && iconNames.length > index"
          :name="iconNames[index]"
          size="30"
        />
      </div>
    </li>
  </ul>

</template>

<script lang="ts" setup>
const { currentStepIndex, steps, iconNames } = defineProps<{
  currentStepIndex: number;
  steps: string[];
  iconNames: string[];
}>();
</script>

<style>
</style>