<template>
  <div>
    <!-- Hero Image -->
    <div>
      <img
        src="/images/top/admin_hero_desktop.jpg"
        class="hidden! w-full lg:block!"
      />
      <img src="/images/top/admin_hero_tablet.jpg" class="w-full lg:hidden!" />
    </div>

    <!-- CTA Button -->
    <div class="px-6 py-4 text-center lg:py-12">
      <div class="text-lg font-bold text-[#F79108] lg:text-xl">
        {{ $t("lp.forRestaurantOwner") }}
      </div>

      <div class="mt-2">
        <router-link
          :to="isAdmin ? `/admin/restaurants` : `/admin/user/signup`"
        >
          <div
            class="bg-ownplate-yellow hover:bg-ownplate-yellow/80 inline-flex h-16 items-center rounded-full px-8 shadow-sm"
          >
            <span class="text-xl font-bold text-black opacity-90">
              {{ $t(isAdmin ? "admin.news.adminTop" : "lp.signUpForFree") }}
            </span>
          </div>
        </router-link>
      </div>

      <div class="mt-4">
        <router-link to="/home">
          <div class="text-op-teal text-lg font-bold lg:text-xl">
            {{ $t("lp.clickHereToOrder") }}
          </div>
        </router-link>
      </div>
    </div>

    <!-- Features -->
    <div class="bg-ownplate-yellow flex justify-center">
      <img
        class="object-cover lg:max-w-7xl"
        src="/images/top/admin_feature.png"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
});
</script>
