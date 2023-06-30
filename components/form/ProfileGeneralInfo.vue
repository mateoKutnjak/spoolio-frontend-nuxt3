<template>
  <div class="flex flex-col gap-8">
    <div class="card-title flex justify-between">
      {{ capitalizeOnlyFirstLetter($t('general_info')) }}
    </div>

    <FormKit
      type="form"
      id="profile-form"
      @submit="submitHandler"
      :actions="false"
    >
      <FormKit
        type="email"
        name="general_email"
        :label="capitalizeOnlyFirstLetter($t('contact_email'))"
        v-model="contact_email_ref"
        validation="email"
        validation-visibility="blur"
      />
      <div class="pt-8">
        <FormKit
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :classes="{
                    input: 'btn btn-primary btn-block btn-sm'
                }"
        />
      </div>

    </FormKit>
  </div>
</template>
      
<script lang="ts" setup>
const { contact_email } = defineProps<{
  contact_email: string;
}>();

const emit = defineEmits(["onSaved"]);

const contact_email_ref = ref<string>(contact_email);

function submitHandler() {
  emit("onSaved", contact_email_ref.value);
}
</script>
      
      <style>
</style>