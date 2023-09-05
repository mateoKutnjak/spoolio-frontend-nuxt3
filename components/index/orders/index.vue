<template>
  <div class="flex md:flex-row flex-col justify-between mb-32">
    <div class="flex flex-col justify-between lg:w-[45%] w-full">
      <div class="xl:text-7xl md:text-6xl font-bold text-base-content pb-10">{{ $t('your_orders').toUpperCase() }}</div>
      <div class="bg-gray-400 h-[390px] w-full lg:hidden block mb-5">
        Picture here
      </div>

      <div class="flex flex-col">
        <div class="text-2xl text-base-content mb-8">{{ capitalizeOnlyFirstLetter($t('create_your_account_so_you_can_easily_track_orders_and_save_all_your_3d_models_for_reprints_or_finishing')) }}</div>
        <div
          class="btn btn-block lg:mr-6 md:mr-4 mr-0 sm:btn-lg xl:!text-3xl sm:!text-2xl xl:!h-20 btn-primary text-base-100"
          @click="dialogStore.open('RegisterForm', {}, $t('sign_up').toUpperCase())"
        >{{ $t('sign_up').toUpperCase() }}</div>
      </div>
    </div>

    <div class="bg-gray-400 h-[390px] w-[50%] lg:block hidden">
      Picture here
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();
</script>

<style>
</style>