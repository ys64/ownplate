<template>
  <div>
    <ownplate-service-image />
    <div class="mx-auto max-w-(--breakpoint-xl)">
      <div class="mx-6 mt-4 text-center lg:grid lg:grid-cols-3 lg:gap-4">
        <!-- For Food Lovers -->
        <div class="mb-4 lg:mb-0">
          <entrance-buttons-food-lovers />
        </div>
        <div class="rounded-lg bg-white lg:col-span-2">
          <!-- Order History -->
          <div class="pt-6 pb-6">
            <history-button />

            <!-- Favorites -->
            <favorite-button />
          </div>
        </div>
      </div>

      <userVoices />
      <!-- <moreButton /> -->
      <!-- <threeSteps /> -->
      <!-- <askButtons /> -->
      <!-- <communityIcons /> -->
      <!-- <mediaLink /> -->
      <operators />
      <aboutService />
      <entrance-buttons />
      <!-- <askButtons /> -->
      <!-- <news /> -->
      <news />
    </div>
    <snslink />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ownplateServiceImage from "@/components/lp/ownplateServiceImage.vue";
import entranceButtons from "@/components/lp/entranceButtons.vue";
import entranceButtonsFoodLovers from "@/components/lp/entranceButtonsFoodLovers.vue";
import userVoices from "@/components/lp/userVoices.vue";
// import moreButton from "@/components/lp/moreButton.vue";
// import threeSteps from "@/components/lp/threeSteps.vue";
// import askButtons from "@/components/lp/askButtons.vue";
// import communityIcons from "@/components/lp/communityIcons.vue";
// import mediaLink from "@/components/lp/mediaLink.vue";
import operators from "@/components/lp/operators.vue";
import aboutService from "@/components/lp/aboutService.vue";
import news from "@/components/lp/news.vue";
import snslink from "@/components/lp/link.vue";

import HistoryButton from "@/components/form/HistoryButton.vue";
import FavoriteButton from "@/components/form/FavoriteButton.vue";

export default defineComponent({
  components: {
    ownplateServiceImage,
    entranceButtons,
    entranceButtonsFoodLovers,
    userVoices,
    //    moreButton,
    //    threeSteps,
    //    askButtons,
    //    communityIcons,
    //    mediaLink,
    operators,
    aboutService,
    news,
    snslink,
    HistoryButton,
    FavoriteButton,
  },
});
</script>
