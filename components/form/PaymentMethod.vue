<template>
    <div class="flex flex-col gap-6">
        HELLO CARDMANN
        <div
        class="btn btn-block btn-primary text-lg"
        @click="onSubmit"
        >{{ capitalizeOnlyFirstLetter($t('save')) }}</div>
    </div>
</template>
    
<script lang="ts" setup>

    function onSubmit() {
        console.log("SUBMITY")
    }
</script>

<style>
</style>