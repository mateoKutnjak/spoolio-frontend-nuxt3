<template>
  <div class="card-body gap-8">
    <div class="card-title flex justify-between">
      General info
    </div>

    <FormKit
      type="form"
      id="profile-form"
      submit-label="Save"
      @submit="submitHandler"
      :actions="false"
    >
      <FormKit
        type="email"
        name="general_email"
        label="Contact email"
        v-model="contact_email_ref"
        validation="email"
        validation-visibility="blur"
      />
      <div class="pt-8">
        <FormKit
          type="submit"
          label="Save"
          :classes="{
                    input: 'btn btn-primary btn-block'
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