<template>
  <div
    class="mx-6 mt-4 flex h-14 items-center justify-between space-x-2 rounded-full bg-black/5 py-4 pr-6 pl-4 lg:mx-auto lg:max-w-2xl"
  >
    <div class="flex items-center space-x-2">
      <i class="material-icons text-2xl text-black/50">tune</i>
      <div class="text-sm font-bold text-black/50">
        {{ selectedCategory.name }}
      </div>
    </div>
    <div class="text-op-teal min-w-fit text-sm font-bold">
      <router-link :to="`/admin/restaurants/${shopInfo.restaurantId}/menus`">
        {{ $t("editMenu.selectCategory") }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    shopInfo: {
      type: Object,
      required: true,
    },
    selectedCategory: {
      type: Object,
      required: true,
    },
  },
});
</script>
