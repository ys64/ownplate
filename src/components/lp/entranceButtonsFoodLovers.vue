<template>
  <!-- For Food Lovers -->
  <div class="mt-4 rounded-lg bg-white p-6 lg:mt-0">
    <i class="material-icons text-7xl opacity-60">local_mall</i>
    <div class="text-sm font-bold text-black opacity-60">
      {{ $t("lp.forCustomer") }}
    </div>
    <!-- Go to Restaurants List -->
    <div class="mt-4">
      <router-link to="/r">
        <div
          class="bg-op-teal hover:bg-op-teal/30 inline-flex h-12 items-center rounded-full px-8 shadow-sm"
        >
          <span class="text-base font-bold text-white">
            {{ $t("lp.searchRestaurant") }}</span
          >
        </div>
      </router-link>
    </div>

    <!-- Go to Samples -->
    <div class="rounded-b-lg py-4">
      <div class="lg:inline-flex lg:items-center lg:space-x-4">
        <div class="inline-flex items-center space-x-4">
          <router-link
            to="/r/area/12"
            class="bg-ownplate-yellow hover:bg-ownplate-yellow/30 inline-flex h-10 items-center rounded-full px-4"
          >
            <span class="text-sm font-bold text-white">{{
              $t("lp.tokyo")
            }}</span>
          </router-link>
          <router-link
            to="/r/area/26"
            class="bg-ownplate-yellow hover:bg-ownplate-yellow/30 inline-flex h-10 items-center rounded-full px-4"
          >
            <span class="text-sm font-bold text-white">{{
              $t("lp.osaka")
            }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>
