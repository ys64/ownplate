<template>
  <section class="mx-auto max-w-full px-6 pt-4 pb-12">
    <div class="text-center text-xl font-bold text-black/30">
      {{ $t("errorPage.requireLogin.message1") }}
    </div>

    <div>
      <t-modal v-model:active="loginModal" width="488" scroll="keep">
        <div class="mx-2 my-6 rounded-lg bg-white p-6 shadow-lg">
          <phone-login v-on:dismissed="handleDismissed" />
        </div>
      </t-modal>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PhoneLogin from "@/app/auth/PhoneLogin.vue";

export default defineComponent({
  components: {
    PhoneLogin,
  },
  props: {
    loginVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const loginModal = ref(props.loginVisible);

    const handleDismissed = () => {
      loginModal.value = false;
    };
    return {
      loginModal,
      handleDismissed,
    };
  },
});
</script>
