<template>
  <div>
    <div class="mb-2 text-xl font-bold text-black/40">
      {{ $t("admin.subAccounts.title") }}
    </div>

    <div class="rounded-lg bg-white p-4 shadow-sm">
      <div class="text-base text-black/60">
        {{ $t("admin.subAccounts.description") }}
      </div>
      <div class="mt-4 text-center">
        <router-link
          to="/admin/subaccounts"
          target="stripe"
          class="border-op-teal inline-flex h-12 items-center rounded-full border-2 px-6"
        >
          <span class="text-op-teal text-base font-bold">{{
            $t("admin.subAccounts.openDashboard")
          }}</span>
        </router-link>
      </div>
      <div class="mt-4 text-center">
        <a
          href="https://docs.omochikaeri.com/manuals/aboutsubaccount.pdf"
          target="_blank"
          class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
        >
          <span class="text-op-teal text-sm font-bold">
            {{ $t("admin.subAccounts.manualLink") }}</span
          >
        </a>
      </div>
    </div>
  </div>
</template>
