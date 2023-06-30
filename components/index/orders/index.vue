<template>
  <div class="flex flex-col gap-6 justify-center px-12 md:px-0">
    <div class="text-3xl font-bold text-stone-600">{{ $t('your_orders').toUpperCase() }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-6 items-start">
        <div class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('create_your_account_so_you_can_easily_track_orders_and_save_all_your_3d_models_for_reprints_or_finishing')) }}</div>
        <div
          class="btn btn-primary text-white"
          @click="dialogStore.open('RegisterForm', {}, $t('sign_up').toUpperCase())"
        >{{ $t('sign_up').toUpperCase() }}</div>
      </div>
      <div class="bg-gray-400">
        Picture here
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();
</script>

<style>
</style>