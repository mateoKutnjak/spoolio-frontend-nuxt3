<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div class="flex flex-col">
      <div class="hero py-12">
        <div class="hero-content text-center">
          <div class="max-w-xl">
            <h1 class="text-5xl font-bold">{{ capitalizeOnlyFirstLetter($t('team_of_engineers_ready_for_your_problems'))}}</h1>
            <p class="py-6">{{ capitalizeOnlyFirstLetter($t('experience_the_benefits_of_3d_printing_technology_and_realize_your_idea')) }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 text-md">
        <div class="text-4xl font-bold">{{ $t('our_vision').toUpperCase() }}</div>
        <p>{{ capitalizeOnlyFirstLetter($t('working_with_3d_printers_and_cad_tools_during_my_studies_at_the_faculty_of_electrical_engineering_and_computing_in_zagreb_showed_us_the_possibilities_that_this_method_opens_up_in_prototyping_modeling_and_production')) }}.</p>
        <p>{{ capitalizeOnlyFirstLetter($t('with_3d_printing_the_journey_from_an_idea_to_a_finished_functional_product_has_become_faster_cheaper_and_simpler')) }}. {{ capitalizeOnlyFirstLetter($t('projects_that_could_not_be_realized_before_were_now_possible_we_had_more_and_more_ideas_and_started_to_think_more_creatively')) }}.</p>
        <div class="space-x-1.5">
          <span>{{ capitalizeOnlyFirstLetter($t('due_to_the_bad_trends_of_the_local_industry_disappearing_and_the_advantages_that_3d_printing_offers_in_2022_we_decided_to_start')) }}</span>
          <span class="font-bold">{{ $t('ur3d_a_workshop_for_the_production_of_3d_printed_plastic_parts__akuzativ') }}.</span>
        </div>
        <div class="space-x-1.5">
          <span>{{ capitalizeOnlyFirstLetter($t('the_goal_of_ur3d_is_to_enable_creative_and_enterprising_individuals_to_in_a_few_clicks')) }}</span>
          <span class="font-bold">{{ $t('experience_the_benefits_of_3d_printing_and_realize_their_idea') }}.</span>
        </div>
      </div>

      <div class="mt-24 flex flex-col gap-4 text-md">
        <div class="text-4xl font-bold">{{ $t('how_we_work').toUpperCase() }}</div>
        <div class="space-x-1.5">
          <span>{{ capitalizeOnlyFirstLetter($t('currently_our_3d_printer_farm_covers')) }}</span>
          <NuxtLink to="/faq/"><span class="font-bold link link-primary">{{ $t('fdm_technology') }}</span></NuxtLink>
          <span>{{ $t('and') }}</span>
          <span>{{ $t('more_precise') }}</span>
          <NuxtLink to="/faq/"><span class="font-bold link link-primary">{{ $t('sla_technology') }}</span></NuxtLink>
          <span>{{ $t('printing_genitiv') }},</span>
          <span>{{ $t('and_the_plan_is_to_expand_capacity_and_introduce_new_production_methods') }}</span>
        </div>
        <div class="space-x-1.5">
          <span>{{ capitalizeOnlyFirstLetter($t('we_are_working_on_automating_and_speeding_up_work_processes_to_make_the_experience_of_using_our_services_easier_for_users')) }}.</span>
          <span>{{ capitalizeOnlyFirstLetter($t('the_first_such_system_is')) }}</span>
          <NuxtLink to="/services/printing/"><span class="font-bold link link-primary">{{ $t('quick_3d_print').toUpperCase() }}</span></NuxtLink>
          <span>{{ $t('on_this_page_which_enables_automatic_price_calculation_billing_printing_and_delivery_of_your_finished_models_without_unnecessary_inquiries') }}.</span>
        </div>
        <div class="space-x-1.5">
          <span>{{ capitalizeOnlyFirstLetter($t('we_are_engineers_who_like_to_realize_various_ideas_from_simple_to_complex')) }}.</span>
          <span>{{ capitalizeOnlyFirstLetter($t('with_expertise_in')) }}</span>
          <NuxtLink to="/services/modeling/"><span class="font-bold link link-primary">{{ $t('_3d_designing_dativ').toUpperCase() }}</span></NuxtLink>
          <span>{{ $t('and') }}</span>
          <NuxtLink to="/services/printing/"><span class="font-bold link link-primary">{{ $t('_3d_printing_dativ').toUpperCase() }}</span></NuxtLink>
          <span>, {{ $t('we_have_knowledge_and_experience_in_the_fields_of') }}</span>
          <span class="font-bold">{{ $t('electronics_mechatronics_programming_and_prototyping_genitiv') }}.</span>
          <span>{{ $t('whatever_idea_you_have_feel_free_to_contact_us_so_that_we_can_find_a_solution_together') }}.</span>
        </div>

      </div>
      <div class="mt-24 grid md:grid-cols-2 grid-cols-1">
        <div class="flex flex-col gap-4 text-md">
          <div class="text-4xl font-bold">{{ $t('contact').toUpperCase() }}</div>
          <div class="mt-12 flex gap-5 items-center">
            <Icon
              class="text-primary"
              size="55"
              name="ph:map-pin"
            />
            <div class="space-x-1.5 max-w-sm">
              <span>{{ capitalizeOnlyFirstLetter($t('we_are_located_within_zicer_at_the_address')) }}</span>
              <span class="font-bold">Paviljon 12, Avenija Dubrovnik 15, 10000, Zagreb.</span>
            </div>
          </div>
          <div class="mt-8 flex gap-6 items-center">
            <Icon
              class="ml-[3px] text-primary"
              size="50"
              name="ph:envelope-simple"
            />
            <div class="space-x-1.5 max-w-sm">
              <span class="font-bold">info.ur3d@gmail.com</span>
            </div>
          </div>
          <div class="mt-8 flex gap-6 items-center">
            <div class="btn btn-circle btn-outline border-4 border-primary btn-lg hover:bg-stone-200 hover:border-primary">
              <Icon
                class="text-primary"
                size="35"
                name="ph:youtube-logo-fill"
              />
            </div>
            <div class="btn btn-circle btn-outline border-4 border-primary btn-lg hover:bg-stone-200 hover:border-primary">
              <Icon
                class="text-primary"
                size="35"
                name="ph:instagram-logo-bold"
              />
            </div>
            <div class="btn btn-circle btn-outline border-4 border-primary btn-lg hover:bg-stone-200 hover:border-primary">
              <Icon
                class="text-primary"
                size="35"
                name="ph:tiktok-logo-bold"
              />
            </div>
          </div>
        </div>
        <div class=" bg-stone-200">Map goes here</div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
</script>
  <style>
</style>