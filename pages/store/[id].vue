<template>
  <div class="container p-12">
    <div class="relative flex gap-6">
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
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, delectus voluptatem quibusdam, quas eos aut accusamus iusto corporis debitis inventore pariatur. Expedita sequi quibusdam placeat enim eius quod libero est? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum reprehenderit sequi animi laboriosam repudiandae architecto ratione eius provident hic illo. Quidem laborum illo suscipit natus! Laudantium enim nobis quisquam minus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam expedita repudiandae aliquid dignissimos atque, alias distinctio repellendus labore nesciunt dolores debitis omnis quasi voluptatum veritatis nam consectetur placeat perferendis asperiores! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, quis illum! Perspiciatis hic sint pariatur excepturi voluptas esse cupiditate reiciendis obcaecati placeat quibusdam! Rem aspernatur ducimus alias quaerat sed dolores? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum alias nisi quas, ab eos dolor earum nam optio eius sit libero. Eius magnam qui debitis ex obcaecati doloribus sapiente tempore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Et saepe quisquam esse suscipit architecto voluptate mollitia ipsa? Odit, reiciendis, aliquid doloribus quas minus ea maxime, dolorum perspiciatis obcaecati dolorem beatae. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati veritatis fugit quidem ad cupiditate! Iste nihil quas suscipit esse libero blanditiis rem qui, voluptatibus quod iure! Doloremque necessitatibus a beatae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate veritatis itaque amet obcaecati aliquid veniam unde perferendis eos totam reiciendis tempore, perspiciatis eum esse excepturi? Cumque atque quo dolore iusto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque perferendis animi dolorem quae impedit ullam, reiciendis a placeat inventore explicabo ipsum laboriosam doloribus? Cupiditate quisquam quaerat exercitationem repellendus aperiam? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio hic libero voluptatem enim tempora, explicabo nesciunt iste. Quia impedit ipsum aut obcaecati, error itaque sed pariatur odio ducimus in ipsam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, exercitationem velit voluptates eligendi tempora obcaecati possimus ab voluptatibus laboriosam maxime ratione modi natus temporibus nobis quasi nesciunt similique assumenda aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse quis quas architecto error? Repellat architecto aliquid inventore minima eveniet maxime. Dicta deleniti totam tempore debitis eum neque eius quasi recusandae. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id qui mollitia culpa illum iste similique molestiae natus veniam est aliquam. Exercitationem optio sequi similique nam quo dolor. Iure, eum error! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae saepe nam accusantium quod. Necessitatibus fugiat, molestias dolorem deleniti temporibus, impedit quia magnam blanditiis, vero et ut iusto vitae doloribus sunt? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam rerum architecto, voluptates ut exercitationem repellat repellendus quam corrupti numquam labore atque. Quis, quam aspernatur. Possimus ut amet odit iste mollitia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quibusdam, natus sunt tempore quo excepturi harum voluptas expedita magnam aspernatur aut eos exercitationem dolores sint laborum nulla est modi ut! Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem repudiandae, officiis dignissimos reprehenderit aliquam explicabo libero, qui velit ad quis labore laudantium voluptatum, corporis sint laborum blanditiis? Placeat, culpa non. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos at voluptatum harum modi tenetur ducimus voluptates eveniet, quam error officiis impedit repellat aut culpa aspernatur? Ducimus modi repudiandae neque! Cumque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius ipsam aspernatur eveniet consequatur optio qui error repellat expedita ullam? Exercitationem voluptatem praesentium et repellat libero eligendi obcaecati quidem consectetur nisi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa quisquam facere earum explicabo, provident magni ab repellendus eos exercitationem velit consequatur error? Quidem ullam corrupti nemo distinctio voluptates delectus vero!</div>
      </div>
      <aside class="sticky top-8 col-span-3 h-full">
        <div class="card border border-gray-300 rounded-2xl shadow-md">
          <div class="card-body flex flex-col">
            <div class="card-title items-center">
              <div class="flex-1">{{product?.title}}</div>
              <div class="flex gap-2">
                <RatingStars />
                <div class="text-sm font-normal">(45)</div>
              </div>
            </div>
            <div class="flex-1 flex flex-col gap-2 mt-8">
              <div class="text-lg">SD type</div>
              <div class="btn-group gap-2">
                <button class="btn btn-accent btn-sm w-24">micro SD</button>
                <button class="btn btn-outline btn-sm w-24">SD</button>
              </div>
            </div>
            <div class="divider h-0"></div>
            <div class="card-actions gap-8 justify-between items-center">
              <div class="text-3xl font-bold">${{product?.price}}</div>
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
import IProductResponse, { useProductStore } from "~~/stores/product";
import { useCartStore } from "~~/stores/cart";

const { id } = useRoute().params;

const cartStore = useCartStore();
const productStore = useProductStore();

const product = ref<IProductResponse>();

onMounted(() => {
  productStore.fetchProduct(Number(id));
});

const getProduct = computed(() => {
  product.value = productStore.getProduct;
  return productStore.getProduct;
});

watch(getProduct, (value, oldValue, onInvalidated) => {
  product.value = value;
});

function addToCart(product: IProductResponse | undefined) {
  if (!product) {
    console.debug("Product is null. Cannot add to cart");
    return;
  }

  cartStore.add(product);
}
</script>
  
  <style>
</style>