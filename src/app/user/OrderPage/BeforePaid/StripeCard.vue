<template>
  <div>
    <div
      v-if="storedCard && hasPayment"
      class="mt-2 flex items-center rounded-lg bg-white p-4 shadow-sm"
    >
      <t-checkbox v-model="useStoredCard">
        <div class="text-base">
          <span>{{ storedCard.brand }}</span>
          <span>**** **** **** {{ storedCard.last4 }}</span>
          <span>・{{ storedCard.exp_month }}/{{ storedCard.exp_year }}</span>
        </div>
      </t-checkbox>
    </div>

    <div v-show="!useStoredCard">
      <!-- Enter New Card -->
      <div class="mt-2 rounded-lg bg-white p-4 shadow-sm">
        <div id="card-element"></div>
      </div>

      <div v-if="!stripeJCB" class="mt-2 text-sm font-bold text-black/60">
        {{ $t("order.no_jcb") }}
      </div>

      <div v-if="isPayingError" class="mt-2 text-center font-bold text-red-600">
        {{ $t("order.card_error") }}
      </div>

      <t-checkbox v-model="save">{{ $t("order.reuseCard") }}</t-checkbox>

      <!-- About CVC -->
      <div class="mt-1">
        <!-- CVC Button -->
        <div class="text-right">
          <a
            class="inline-flex cursor-pointer items-center justify-center"
            @click="openCVC()"
          >
            <i class="material-icons text-op-teal mr-1 text-lg">help_outline</i>
            <span class="text-op-teal text-sm font-bold">{{
              $t("order.whatsCVC")
            }}</span>
          </a>
        </div>

        <!-- CVC Popup-->
        <t-modal v-model:active="CVCPopup" width="488" scroll="keep">
          <div class="mx-2 my-6 rounded-lg bg-white p-6 shadow-lg">
            <!-- Title -->
            <div class="text-xl font-bold text-black/40">
              {{ $t("order.whatsCVC") }}
            </div>

            <!-- 3 Digits -->
            <div class="mt-2 rounded-lg bg-black/5 p-4 text-center">
              <div class="text-xl font-bold">
                Visa, MasterCard, JCB, Diners Club, DISCOVER
              </div>

              <div class="mt-2 text-center text-base font-bold text-blue-500">
                {{ $t("order.3digitsCVC") }}
              </div>

              <div class="mt-2">
                <img src="/CVC-3digits-1.svg" />
              </div>

              <div class="mt-1">
                <img src="/CVC-3digits-2.svg" />
              </div>
            </div>

            <!-- 4 Digits -->
            <div class="mt-2 rounded-lg bg-black/5 p-4 text-center">
              <div class="text-xl font-bold">American Express</div>

              <div class="mt-2 text-center text-base font-bold text-blue-500">
                {{ $t("order.4digitsCVC") }}
              </div>

              <div class="mt-2">
                <img src="/CVC-4digits-Amex.svg" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 text-center">
              <a
                @click="closeCVC()"
                class="inline-flex h-12 items-center justify-center rounded-full bg-black/5 px-6"
                style="min-width: 8rem"
              >
                <div class="text-base font-bold text-black/60">
                  {{ $t("menu.close") }}
                </div>
              </a>
            </div>
          </div>
        </t-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from "vue";

import { getStripeInstance } from "@/lib/stripe/stripe";
import { db } from "@/lib/firebase/firebase9";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";

// import { useUserData } from "@/utils/utils";
// import { useStore } from "vuex";

export default defineComponent({
  emits: ["change"],
  props: {
    stripeJCB: {
      type: Boolean,
      required: true,
    },
    stripeAccount: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    ownerUid: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    hasPayment: {
      type: Boolean,
      required: true,
    },
    isPayingError: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const stripe = getStripeInstance(props.stripeAccount);
    const cardElem = ref<any>(null);
    let elementStatus = { complete: false };

    const storedCard = ref(null);
    const useStoredCard = ref(false);
    const save = ref(true);

    const CVCPopup = ref(false);

    const elements = stripe.elements({ clientSecret: props.clientSecret });
    const configureStripe = async () => {
      const cardElement = elements.create("payment", {});
      cardElement.mount("#card-element");
      cardElem.value = cardElement;
      cardElem.value.addEventListener("change", (status: any) => {
        elementStatus = status;
        if (!useStoredCard.value) {
          ctx.emit("change", status);
        }
      });

      try {
        const stripeInfo = (
          await getDoc(
            doc(
              db,
              `/users/${props.uid}/owner/${props.ownerUid}/readonly/stripe`,
            ),
          )
        ).data();
        if (stripeInfo && stripeInfo.card) {
          const date = ("00" + String(stripeInfo.card.exp_month)).slice(-2);
          const expire = moment(
            `${stripeInfo.card.exp_year}${date}01T000000+0900`,
          )
            .endOf("month")
            .toDate();
          // console.log(expire);
          if (
            stripeInfo.updatedAt &&
            stripeInfo.updatedAt.toDate() >
              moment().subtract(180, "days").toDate()
          ) {
            if (expire > new Date()) {
              storedCard.value = stripeInfo.card;
              useStoredCard.value = true;
              ctx.emit("change", { complete: true });
            }
          }
        }
      } catch (e) {
        console.log(e);
        console.log("stripe expired");
      }
    };

    onMounted(() => {
      configureStripe();
    });

    watch(useStoredCard, (newValue) => {
      ctx.emit("change", newValue ? { complete: true } : elementStatus);
    });

    const confirmPayment = async () => {
      return await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });
    };

    const confirmCardPayment = async () => {
      return await stripe.confirmCardPayment(props.clientSecret);
    };

    const processPayment = async () => {
      if (props.hasPayment && useStoredCard.value) {
        return await confirmCardPayment();
      }
      return await confirmPayment();
    };

    const openCVC = () => {
      CVCPopup.value = true;
    };
    const closeCVC = () => {
      CVCPopup.value = false;
    };
    const isSavePay = computed(() => {
      return !useStoredCard.value && save.value;
    });
    return {
      useStoredCard,
      storedCard,

      save,
      isSavePay,

      CVCPopup,

      openCVC,
      closeCVC,

      processPayment,
    };
  },
});
</script>
