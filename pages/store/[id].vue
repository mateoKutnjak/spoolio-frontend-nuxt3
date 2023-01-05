<template>
  <div class="container p-12">
    <div class="relative flex flex-col md:flex-row gap-6">
      <div class="flex-1 flex flex-col gap-3 items-center">
        <nuxt-img
          class="rounded-2xl shadow-md"
          src="https://placeimg.com/900/400/people"
          fit="fill"
        />
        <div class="flex gap-3 items-center">
          <div class="btn btn-ghost btn-square">
            <Icon
              name="material-symbols:arrow-back-ios-new-rounded"
              size="30"
              aria-hidden="true"
            />
          </div>
          <div class="text-lg">2/5</div>
          <div class="btn btn-ghost btn-square">
            <Icon
              name="material-symbols:arrow-forward-ios-rounded"
              size="30"
              aria-hidden="true"
            />
          </div>
        </div>
        <div>{{product?.description}}</div>
      </div>
      <aside class="md:sticky order-first md:order-last top-8 col-span-3 h-full">
        <div class="card border border-gray-300 rounded-2xl shadow-md bg-white">
          <div class="card-body gap-10">
            <div class="card-title gap-12 items-center">
              <div class="flex-1">{{product?.title}}</div>
              <div class="flex gap-2">
                <RatingStars />
                <div class="text-sm font-normal">(45)</div>
              </div>
            </div>
            <div
              :class="activeOptionsCombination?.sku ? 'text-success' : 'text-error'"
              class="font-bold text-error text-lg"
            >{{ activeOptionsCombination?.sku ? activeOptionsCombination?.sku : 'Not '}} available in stock </div>
            <div class="flex-1 flex flex-col gap-5">
              <div
                class="flex flex-col gap-1"
                v-for="[variationName, variations] in productVariationOptions"
                :key="variationName"
              >
                <div class="flex gap-1 items-start">
                  <div class="text-gray-700 text-base font-medium">{{ variationName }}</div>
                  <div class="dropdown dropdown-end">
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
                  </div>
                </div>
                <div class="btn-group gap-1">
                  <div
                    class="btn btn-outline btn-sm border-gray-400 text-gray-600"
                    :class="productVariationOptionSelections.get(variationName) === index ? 'btn-active' : ''"
                    v-for="option, index in variations"
                    :key="option.title"
                    @click="setOption(variationName, index)"
                  >{{ option.title }}
                  </div>
                </div>
              </div>
            </div>
            <div class="card-actions gap-12 justify-between items-center">
              <div v-if="activeOptionsCombination?.price">
                <div class="text-3xl font-semibold text-gray-700">{{`$${activeOptionsCombination?.price}`}}</div>
              </div>
              <div v-else>
                <div class="text-3xl font-semibold text-gray-700">-</div>
              </div>
              <button
                class="btn btn-info gap-1"
                :class="activeOptionsCombination?.price ? '' : 'btn-disabled' "
                @click="addToCart(product)"
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
import {
  IProductResponse,
  IProductVariationOptionResponse,
  useProductStore,
} from "~~/stores/product";
import { useCartStore } from "~~/stores/cart";
import { storeToRefs } from "pinia";

const { id } = useRoute().params;

const cartStore = useCartStore();
const productStore = useProductStore();

const { product, activeOptionsCombination } = storeToRefs(productStore);

const productVariationOptions = ref(
  new Map<string, IProductVariationOptionResponse[]>()
);
const productVariationOptionSelections = ref(new Map<string, number>());

onMounted(() => {
  productStore.fetchProduct(Number(id)).then((res) => {
    productVariationOptions.value = extractProductVariations();
    setDefaultCombination(productVariationOptions.value);

    productStore.fetchProductVariationOptionCombination(
      getCurrentOptionIds(),
      Number(id)
    );
  });
});

watch(productVariationOptionSelections, (value) => {
  console.log(value);
});

function setDefaultCombination(
  opts: Map<string, IProductVariationOptionResponse[]>
) {
  opts.forEach((value: IProductVariationOptionResponse[], key: string) => {
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

  productStore.fetchProductVariationOptionCombination(
    currentOptionIds,
    Number(id)
  );
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

function addToCart(product: IProductResponse | undefined) {
  if (!product) {
    console.debug("Product is null. Cannot add to cart");
    return;
  }

  cartStore.add(product);
}

function extractProductVariations(): Map<
  string,
  IProductVariationOptionResponse[]
> {
  let options = new Map<string, IProductVariationOptionResponse[]>();

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