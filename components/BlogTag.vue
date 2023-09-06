<template>
  
    <div
      class="btn btn-sm text-sm btn-outline border-2 border-primary text-primary font-bold rounded-full no-animation"
    >
      {{ title }}
    </div>

</template>
  
  <script lang="ts" setup>
  const { title } = defineProps<{
    title: string;
  }>();
  </script>
  
  <style>
  </style>