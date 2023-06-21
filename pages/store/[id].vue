<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div class="relative flex flex-col md:flex-row gap-6">
      <div class="flex-1 flex flex-col gap-8 items-start">
        <div
          v-if="product?.productimage_set?.length"
          class="w-full flex flex-col gap-3 text-center"
        >
          <div class="flex">
            <nuxt-img
              class="rounded-md h-96 w-full shadow-md"
              :src="product?.productimage_set[currentImageIndex].image"
              style="object-fit: cover;"
            />
          </div>
          <div class="text-gray-700 italic font-semibold">{{product?.productimage_set[currentImageIndex].comment}}</div>
          <div class="flex gap-3 justify-center items-center">
            <div
              class="btn btn-ghost btn-square"
              @click="onPreviousImage"
            >
              <Icon
                class="text-gray-700"
                name="lucide:chevron-left"
                size="25"
                aria-hidden="true"
              />
            </div>
            <div class="text-lg font-medium text-gray-700">{{currentImageIndex+1}} / {{product?.productimage_set.length}}</div>
            <div
              class="btn btn-ghost btn-square"
              @click="onNextImage"
            >
              <Icon
                class="text-gray-700"
                name="lucide:chevron-right"
                size="25"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="text-gray-700">{{product?.description}}</div>
        <RatingList
          v-if="product"
          :object-id="product?.id"
          :content-type="CONTENT_TYPE_PRODUCT"
          :rated-by-me="product.rated_by_me"
        />
      </div>
      <aside class="md:sticky order-first md:order-last top-8 h-full md:w-1/3">
        <div class="card border border-gray-300 rounded-sm shadow-md bg-white">
          <div class="card-body">
            <div class="card-title items-center mb-6">
              <div class="flex-1 text-base text-stone-600 line-clamp-3">{{product?.title}}</div>
              <RatingPreview
                :rating-value="product?.average_rating || 0"
                :rating-count="product?.rating_count || 0"
              />
            </div>
            <div class="divider mt-0 mb-6 h-0"></div>

            <div class="mb-3 flex-1 flex flex-col gap-3 items-start">
              <div
                v-for="[variationName, variations] in productVariationOptions"
                :key="variationName"
              >
                <div class="flex flex-col gap-1 items-start">
                  <div class="font-semibold text-sm text-stone-700 dark:text-white">{{ variationName }}</div>
                  <!-- <div class="dropdown dropdown-end">
                    <label
                      tabindex="0"
                      class="btn btn-ghost btn-xs text-info text-xs"
                    >
                      <div>What is this?</div>
                    </label>
                    <div
                      tabindex="0"
                      class="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
                    >
                      <div class="card-body">
                        <p>TODO variation description</p>
                      </div>
                    </div>
                  </div> -->
                  <div class="flex flex-wrap gap-1">
                    <div
                      class="btn btn-sm text-stone-600 rounded"
                      :class="productVariationOptionSelections.get(variationName) === index ? 'btn-primary' : 'btn-outline'"
                      v-for="option, index in variations"
                      :key="option.title"
                      @click="setOption(variationName, index)"
                    >{{ capitalizeOnlyFirstLetter($t(option.title)) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="activeOptionsCombination?.sku"
                class="flex gap-2 items-center text-center mt-3 font-normal text-lg text-gray-700 dark:text-white"
              >
                <Icon
                  class="text-success"
                  name="lucide:check-circle"
                  size="25"
                />{{ activeOptionsCombination?.sku }} {{ $t('in_stock') }}
              </div>
              <div
                v-else
                class="flex gap-2 items-center text-center mt-3 font-normal text-lg text-gray-700 dark:text-white"
              >
                <Icon
                  class="text-error"
                  name="lucide:x-circle"
                  size="25"
                />
                {{ capitalizeOnlyFirstLetter($t('out_of_stock')) }}
              </div>
            </div>

            <div class="card-actions gap-12 justify-between items-center">
              <div v-if="activeOptionsCombination?.price">
                <div class="text-3xl text-stone-600 dark:text-white">
                  {{`€${activeOptionsCombination?.price}`}}
                </div>
              </div>
              <div v-else>
              </div>
              <button
                class="btn gap-3"
                :class="activeOptionsCombination?.price ? 'btn-success' : 'btn-disabled' "
                @click="addToCart"
              >
                <Icon
                  name="lucide:shopping-cart"
                  size="22"
                  aria-hidden="true"
                />{{ capitalizeOnlyFirstLetter($t('add_to_cart')) }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { useProductStore } from "~~/stores/product";
import { useCartStore } from "~~/stores/cart";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "~~/stores/notification";
import { CONTENT_TYPE_PRODUCT } from "~~/constants/constants";
import { IProductVariationOption } from "~~/constants/data";

const { id } = useRoute().params;

const cartStore = useCartStore();
const notificationStore = useNotificationStore();
const productStore = useProductStore();

const { product, activeOptionsCombination } = storeToRefs(productStore);

const productVariationOptions = ref(
  new Map<string, IProductVariationOption[]>()
);
const productVariationOptionSelections = ref(new Map<string, number>());
const currentImageIndex = ref(0);

onMounted(() => {
  productStore
    .fetchProduct(Number(id))
    .then((res) => {
      productVariationOptions.value = extractProductVariations();
      setDefaultCombination(productVariationOptions.value);

      productStore.fetchProductVariationOptionCombination(
        getCurrentOptionIds(),
        Number(id)
      );
    })
    .catch((err) => notificationStore.showFetchError(err));
});

onBeforeRouteLeave((to, from, next) => {
  productStore.clear();
  next();
});

watch(productVariationOptionSelections, (value) => {
  console.log(value);
});

function onPreviousImage() {
  if (product.value?.productimage_set) {
    let tmp = currentImageIndex.value;
    tmp -= 1;
    if (tmp < 0) {
      tmp = product.value?.productimage_set.length - 1;
    }
    currentImageIndex.value = tmp;
  }
}

function onNextImage() {
  if (product.value?.productimage_set) {
    let tmp = currentImageIndex.value;
    tmp += 1;
    tmp = tmp % product.value?.productimage_set.length;
    currentImageIndex.value = tmp;
  }
}

function setDefaultCombination(opts: Map<string, IProductVariationOption[]>) {
  opts.forEach((value: IProductVariationOption[], key: string) => {
    if (value.length > 0) {
      productVariationOptionSelections.value.set(value[0].type.name, 0);
    }
  });
}

function setOption(optionName: string, index: number) {
  if (!product.value) {
    console.log("TODO error 0");
    return;
  }

  productVariationOptionSelections.value.set(optionName, index);

  const currentOptionIds = getCurrentOptionIds();

  productStore
    .fetchProductVariationOptionCombination(currentOptionIds, Number(id))
    .catch((err) => notificationStore.showFetchError(err));
}

function getCurrentOptionIds(): number[] {
  if (!product.value) {
    console.log("TODO error 0");
    return [];
  }

  const optionIds: number[] = [];

  productVariationOptionSelections.value.forEach(
    (selectionIndex: number, optionName: string) => {
      if (!productVariationOptions.value.get(optionName)) {
        console.log("TODO error 2");
        return;
      }

      const options = productVariationOptions.value.get(optionName)!;
      const option = options[selectionIndex];

      optionIds.push(option.id);
    }
  );

  return optionIds;
}

function addToCart() {
  if (!product.value || !activeOptionsCombination.value) {
    console.debug("Productor combination is null. Cannot add to cart");
    return;
  }

  cartStore.add(
    activeOptionsCombination.value.id,
    activeOptionsCombination.value
  );
}

function extractProductVariations(): Map<string, IProductVariationOption[]> {
  let options = new Map<string, IProductVariationOption[]>();

  if (!product.value?.productvariationoption_set) {
    return options;
  }

  for (
    let index = 0;
    index < product.value?.productvariationoption_set.length;
    index++
  ) {
    const element = product.value?.productvariationoption_set[index];

    let oldArray = options.get(element.type.name);

    if (oldArray) {
      options.set(element.type.name, [...oldArray, element]);
    } else {
      options.set(element.type.name, [element]);
    }
  }

  return options;
}
</script>
  
  <style>
</style>