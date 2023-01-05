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
          <div class="card-body">
            <div class="card-title items-center">
              <div class="flex-1">{{product?.title}}</div>
              <div class="flex gap-2">
                <RatingStars />
                <div class="text-sm font-normal">(45)</div>
              </div>
            </div>
            <div class="flex-1 flex flex-col gap-5 mt-8">
              <div
                class="flex flex-col gap-2"
                v-for="optionName in productVariationOptions?.keys()"
                :key="optionName"
              >
                <div class="text-gray-700 text-base italic">{{ optionName }}:</div>
                <div class="btn-group gap-1">
                  <div
                    class="btn btn-outline btn-sm border-gray-400 text-gray-600"
                    :class="productVariationOptionSelections.get(optionName) === index ? 'btn-active' : ''"
                    v-for="options, index in productVariationOptions?.get(optionName)"
                    :key="options.title"
                    @click="setOption(optionName, index)"
                  >{{ options.title }}
                  </div>
                </div>
              </div>
            </div>
            <div class="divider h-0"></div>
            <div class="card-actions gap-8 justify-between items-center">
              <div class="text-3xl font-bold">{{ `$${activeOptionsCombination?.price}` || 'null' }}</div>
              <button
                class="btn btn-info gap-1"
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

const { activeOptionsCombination } = storeToRefs(productStore);

const product = ref<IProductResponse>();
const productVariationOptions = ref(
  new Map<string, IProductVariationOptionResponse[]>()
);
const productVariationOptionSelections = ref(new Map<string, number>());

onMounted(() => {
  productStore.fetchProduct(Number(id));
});

const getProductVariationOptions = computed(() => {
  product.value = productStore.getProduct;
  productVariationOptions.value = extractProductVariations();
  return productStore.getProduct;
});

watch(getProductVariationOptions, (value, oldValue, onInvalidated) => {
  product.value = value;
});

watch(productVariationOptionSelections, (value) => {
  console.log(value);
});

function setOption(optionName: string, index: number) {
  if (!product.value) {
    console.log("TODO error 0");
    return;
  }

  productVariationOptionSelections.value.set(optionName, index);

  const optionIds: number[] = [];

  console.log(productVariationOptionSelections.value.keys);

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

  productStore.fetchProductVariationOptionCombination(
    optionIds,
    product.value?.id
  );
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

    productVariationOptionSelections.value.set(element.type.name, 0);

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