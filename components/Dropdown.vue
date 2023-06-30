 <template>
  <div class="">
    <Menu
      as="div"
      class="relative inline-block text-left w-full "
    >
      <MenuButton
        class="w-full rounded-md"
        :class="disabled ? 'btn-disabled' : ''"
      >
        <div
          class="btn  btn-ghost btn-block gap-1 rounded-md pt-1"
          :class="`${backgroundColor} ${textColor} btn-${size}`"
        >
          <div class="w-full flex justify-between">{{ $t(extractName(selectedItem)) }}
            <Icon name="ph:caret-down-bold" />
          </div>
        </div>
      </MenuButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="z-20 absolute left-0 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="px-1 py-1">
            <div
              v-for="item, index in items"
              :key="index"
            >

              <MenuItem
                as="div"
                @click="selectedItem=item"
              >
              <div class="btn btn-ghost btn-block justify-start text-stone-700 font-normal">
                {{$t(extractName(item))}}
              </div>
              </MenuItem>
            </div>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const {
  items,
  preselectedItem,
  extractName,
  backgroundColor,
  size,
  textColor,
  disabled,
} = defineProps<{
  items: any[];
  preselectedItem: any;
  extractName: Function;
  backgroundColor?: string;
  size?: string;
  textColor?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(["onItemClicked"]);

const selectedItem = ref(preselectedItem);

watch(selectedItem, (value) => {
  emit("onItemClicked", value);
});
</script>

<style>
</style>