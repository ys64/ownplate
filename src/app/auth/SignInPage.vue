<template>
  <div class="mx-6 mt-2 lg:mx-auto lg:max-w-2xl">
    <!-- Note for the First User -->
    <div class="rounded-lg bg-green-600/10 p-6">
      <div class="flex">
        <div>
          <i class="material-icons mr-4 shrink-0 text-4xl text-green-600"
            >info</i
          >
        </div>

        <div class="flex-1 text-base font-bold">
          {{ $t("admin.encourageToReadManual.before") }}
          <a
            href="https://docs.omochikaeri.com/manuals/manual.pdf"
            target="_blank"
          >
            {{ $t("admin.encourageToReadManual.manualName") }}
          </a>
          {{ $t("admin.encourageToReadManual.after") }}
        </div>
      </div>
    </div>

    <!-- Sign In Card -->
    <div class="mt-2 rounded-lg bg-white p-6 shadow-sm">
      <form @submit.prevent="onSignin">
        <div class="text-xl font-bold text-black/30">
          {{ $t("admin.pleaseSignIn") }}
        </div>

        <!-- Email -->
        <div class="mt-4">
          <div class="text-sm font-bold">
            {{ $t("admin.email") }}
          </div>

          <div class="mt-1">
            <o-field
              :variant="errors.email ? 'danger' : 'success'"
              :message="errors.email && $t(errors.email[0])"
            >
              <input
                class="w-full rounded border px-2 py-1 whitespace-nowrap"
                v-model="email"
                type="email"
                :placeholder="$t('admin.emailPlaceHolder')"
                maxlength="256"
              />
            </o-field>
          </div>
        </div>

        <!-- Password -->
        <div class="mt-2">
          <div class="text-sm font-bold">
            {{ $t("admin.password") }}
          </div>

          <div class="mt-1">
            <o-field
              :variant="errors.password ? 'danger' : 'success'"
              :message="errors.password && $t(errors.password[0])"
            >
              <input
                class="w-full rounded border px-2 py-1 whitespace-nowrap"
                v-model="password"
                type="password"
                :placeholder="$t('admin.passwordPlaceHolder')"
                maxlength="30"
                password-reveal
              />
            </o-field>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-2 text-center">
          <button @click="handleCancel" class="mr-4 mb-2 cursor-pointer">
            <div
              class="inline-flex h-12 w-32 items-center justify-center rounded-full bg-black/5"
            >
              <div class="text-base font-bold text-black/60">
                {{ $t("button.cancel") }}
              </div>
            </div>
          </button>
          <t-button @click="onSignin" class="h-12 w-32 font-bold text-white">
            {{ $t("button.next") }}
          </t-button>
        </div>

        <!-- Forgot Password -->
        <div class="mt-2 text-center">
          <router-link to="/admin/user/reset">
            <div class="inline-flex items-center justify-center">
              <i class="material-icons text-op-teal mr-2 text-lg">help</i>
              <span class="text-op-teal text-sm font-bold">{{
                $t("admin.forgotPassword")
              }}</span>
            </div>
          </router-link>
        </div>
      </form>
    </div>

    <!-- Sign Up as a New User -->
    <div class="mt-12 text-center">
      <div class="font-bold text-black/40">
        {{ $t("admin.forSignup") }}
      </div>

      <div class="mt-2">
        <router-link to="/admin/user/signup">
          <div
            class="bg-ownplate-yellow hover:bg-ownplate-yellow/80 inline-flex h-16 items-center rounded-full px-8 shadow-sm"
          >
            <span class="text-xl font-bold text-black opacity-90">
              {{ $t("lp.signUpForFree") }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { auth } from "@/lib/firebase/firebase9";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserData, defaultTitle } from "@/utils/utils";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useHead } from "@unhead/vue";

export default defineComponent({
  name: "Signin",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const email = ref("");
    const password = ref("");
    const errors = ref({});

    const { user, isAdmin } = useUserData();

    useHead(() => ({
      title: [defaultTitle, "Signin Admin"].join(" / "),
    }));

    const redirectToAdminPage = () => {
      const redirect = route.query["to"] as string;
      const pathRegex = /^\/[a-zA-Z0-9-_/]+$/;

      if (redirect && pathRegex.test(redirect)) {
        router.push(redirect);
      } else {
        router.push("/admin/restaurants");
      }
    };

    if (isAdmin.value) {
      redirectToAdminPage();
    }

    watch(user, (newValue) => {
      console.log("user changed");
      if (newValue) {
        redirectToAdminPage();
      }
    });

    const handleCancel = () => {
      router.push("/");
    };
    const onSignin = () => {
      store.commit("setLoading", true);
      errors.value = {};
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          console.log("onSignin success");
          store.commit("setLoading", false);
        })
        .catch((error) => {
          console.log("onSignin failed", error.code, error.message);
          const errorCode = "admin.error.code." + error.code;
          if (
            error.code === "auth/wrong-password" ||
            error.code === "auth/internal-error"
          ) {
            errors.value = { password: [errorCode] };
          } else {
            errors.value = { email: [errorCode] };
          }
          store.commit("setLoading", false);
        });
    };
    return {
      email,
      password,
      errors,

      handleCancel,
      onSignin,
    };
  },
});
</script>
