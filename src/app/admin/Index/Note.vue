<template>
  <!-- Notes -->
  <div class="mt-4">
    <div class="mb-2 text-xl font-bold text-black/40">
      {{ $t("admin.notes.title") }}
    </div>

    <div class="rounded-lg border-2 border-solid border-black/10 p-4">
      <div>
        <div class="pb-2 text-base font-bold text-black/60">
          {{ $t("admin.notes.userRestaurantsTitle") }}
        </div>
        <div class="text-base text-black/60">
          {{ $t("admin.notes.userRestaurantsBody") }}
        </div>
      </div>

      <div class="mt-4 border-t-2 border-solid border-black/10 pt-4">
        <div class="pb-2 text-base font-bold text-black/60">
          {{ $t("admin.notes.notificationSoundTitle") }}
        </div>
        <div class="text-base text-black/60">
          {{ $t("admin.notes.notificationSoundBody") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {},
});
</script>
