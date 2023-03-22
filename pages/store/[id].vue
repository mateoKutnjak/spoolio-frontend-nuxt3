<template>
  <div class="container p-12">
    <div class="relative flex flex-col md:flex-row gap-6">
      <div class="flex-1 flex flex-col gap-8 items-start">
        <div
          v-if="product?.productimage_set?.length"
          class="w-full flex flex-col gap-3 text-center"
        >
          <div class="flex">
            <nuxt-img
              class="rounded-2xl h-96 w-full shadow-md"
              :src="product?.productimage_set[currentImageIndex].image"
              style="object-fit: cover;"
            />
          </div>
          <div class="text-gray-700 italic">{{product?.productimage_set[currentImageIndex].comment}}</div>
          <div class="flex gap-3 justify-center items-center">
            <div
              class="btn btn-ghost btn-square"
              @click="onPreviousImage"
            >
              <Icon
                class="text-gray-700"
                name="material-symbols:arrow-back-ios-new-rounded"
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
                name="material-symbols:arrow-forward-ios-rounded"
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
      <aside class="md:sticky order-first md:order-last top-8 col-span-3 h-full">
        <div class="card border border-gray-300 rounded-2xl shadow-md bg-white">
          <div class="card-body">
            <div class="card-title items-center mb-6">
              <div class="flex-1 font-light text-xl text-gray-800 dark:text-white">{{product?.title}}</div>
              <RatingPreview
                :rating-value="product?.average_rating || 0"
                :rating-count="product?.rating_count || 0"
              />
            </div>
            <div class="flex-1 flex flex-col gap-3">
              <div
                v-for="[variationName, variations] in productVariationOptions"
                :key="variationName"
              >
                <div class="flex gap-4 items-center">
                  <div class="text-gray-700 font-light text-lg text-gray-800 dark:text-white">{{ variationName }}</div>
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
                  <div class="btn-group gap-1">
                    <div
                      class="btn btn-outline btn-xs border-gray-400 text-gray-600"
                      :class="productVariationOptionSelections.get(variationName) === index ? 'btn-active' : ''"
                      v-for="option, index in variations"
                      :key="option.title"
                      @click="setOption(variationName, index)"
                    >{{ option.title }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="activeOptionsCombination?.sku"
                class="flex gap-2 items-center text-center mt-6 font-normal text-lg text-gray-700 dark:text-white"
              >
                <Icon
                  class="text-success"
                  name="material-symbols:check-circle-rounded"
                  size="25"
                />{{ activeOptionsCombination?.sku }} available in stock
              </div>
              <div
                v-else
                class="flex gap-2 items-center text-center mt-6 font-normal text-lg text-gray-700 dark:text-white"
              >
                <Icon
                  class="text-error"
                  name="material-symbols:cancel-rounded"
                  size="25"
                />
                Out of stock
              </div>
            </div>
            <div class="divider m-3"></div>

            <div class="card-actions gap-12 justify-between items-center">
              <div v-if="activeOptionsCombination?.price">
                <div class="text-3xl font-light text-xl text-gray-800 dark:text-white">
                  {{`€${activeOptionsCombination?.price}`}}
                </div>
              </div>
              <div v-else>
              </div>
              <button
                class="btn btn-success gap-1"
                :class="activeOptionsCombination?.price ? '' : 'btn-disabled' "
                @click="addToCart"
              >
                <Icon
                  name="material-symbols:shopping-cart-outline-rounded"
                  size="27"
                  aria-hidden="true"
                />Add to cart
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

  notificationStore.show("Added to cart", ToastLevelType.success);
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