<template>
  <div class="bg-ownplate-yellow mt-2 p-4">
    <div
      class="m-auto inline-flex w-full items-center justify-center text-center"
    >
      <!-- Facebook User Group -->
      <div class="inline-block px-1 pb-2" v-if="false">
        <a
          href="https://www.facebook.com/groups/278028420106364/"
          target="_blank"
        >
          <div
            class="inline-flex h-9 items-center justify-center rounded-full bg-white/80 px-4"
          >
            <i class="fab fa-facebook text-op-teal mr-2 text-lg"></i>
            <span class="text-op-teal text-sm font-bold">{{
              $t("admin.facebookUserGroup")
            }}</span>
          </div>
        </a>
      </div>

      <!-- X -->
      <div class="inline-block px-1 pb-2">
        <a href="https://x.com/omochikaericom" target="_blank">
          <div
            class="inline-flex h-9 items-center justify-center rounded-full bg-white/80 px-4 hover:bg-white"
          >
            <i class="fab fa-x-twitter text-op-teal mr-2 text-lg"></i>
            <span class="text-op-teal text-sm font-bold">(Twitter)</span>
          </div>
        </a>
      </div>

      <!-- Note -->
      <div class="inline-block px-1 pb-2">
        <a href="https://note.com/singsoc/m/m19dd935e84e4" target="_blank">
          <div
            class="inline-flex h-9 items-center justify-center rounded-full bg-white/80 px-4 hover:bg-white"
          >
            <span class="text-op-teal text-sm font-bold">Note</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {};
</script>
