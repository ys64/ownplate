<template>
  <div class="rounded-lg bg-white shadow-sm">
    <!-- Location -->
    <div v-if="hasLocation">
      <div>
        <a target="_blank" :href="mapQuery">
          <img :src="mapImage" class="w-full object-cover lg:rounded-lg" />
        </a>
      </div>
      <div class="mx-4 mt-4 pb-2">
        <a target="_blank" :href="mapQuery">
          <div class="inline-flex items-center justify-center">
            <i class="material-icons text-op-teal mr-2 text-lg">place</i>
            <div class="text-op-teal text-sm font-bold">
              <div v-if="region === 'JP'">
                〒{{ shopInfo.zip }} {{ shopInfo.state }}
                {{ shopInfo.city }}
                {{ shopInfo.streetAddress }}
              </div>
              <div v-else>
                {{ shopInfo.streetAddress }}, {{ shopInfo.city }},
                {{ shopInfo.state }} {{ shopInfo.zip }}
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div v-else class="h-4"></div>

    <div class="p-4 pt-0">
      <!-- Restaurant Phone Number -->
      <div>
        <template v-if="phoneUrl">
          <a :href="phoneUrl">
            <div class="inline-flex items-center justify-center">
              <i class="material-icons text-op-teal mr-2 text-lg">phone</i>
              <div class="text-op-teal text-sm font-bold">
                {{ nationalPhoneNumber }}
              </div>
            </div>
          </a>
        </template>
        <template v-else>
          <div class="inline-flex items-center justify-center">
            <i class="material-icons mr-2 text-lg">phone</i>
            <div class="text-sm font-bold">{{ nationalPhoneNumber }}</div>
          </div>
        </template>
      </div>

      <!-- Minimum Available Time -->
      <div
        class="mt-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm"
        v-if="!shopInfo.isEC"
      >
        <div class="text-sm font-bold">
          {{ $t("shopInfo." + (isDelivery ? "delivery" : "takeout")) }}:{{
            $t("shopInfo.minimumAvailableTime")
          }}
        </div>
        <div>
          {{ minimumAvailableTime }}
        </div>
        <div v-if="lastTime">
          {{ $t("shopInfo.lastOrder") }}: {{ lastTime.lastOrderTime }}
        </div>
        <div v-else>
          {{ $t("shopInfo.todayNotAvailable") }}
        </div>
      </div>

      <!-- More Info Button -->
      <div class="mt-4 text-center">
        <a
          @click="toggleMoreInfo()"
          class="inline-flex h-9 w-32 cursor-pointer items-center justify-center rounded-full bg-black/5"
        >
          <div class="text-op-teal text-sm font-bold">
            <template v-if="moreInfo">{{ $t("shopInfo.viewLess") }}</template>
            <template v-else>{{ $t("shopInfo.viewMore") }}</template>
          </div>
        </a>
      </div>

      <!-- More Info -->
      <div v-if="moreInfo">
        <!-- Transactions Act -->
        <div class="mt-4">
          <transactions-act
            :shopInfo="shopInfo"
            :isDelivery="isDelivery"
          ></transactions-act>
        </div>

        <!-- Restaurant Website -->
        <div v-if="hasUrl" class="mt-4">
          <a
            target="_blank"
            :href="shopInfo.url"
            class="inline-flex items-center justify-center"
            rel="noopener noreferrer"
          >
            <div class="text-op-teal text-sm font-bold">
              {{ $t("shopInfo.visitWebsite") }}
            </div>
            <i class="material-icons text-op-teal ml-1 text-lg">launch</i>
          </a>
        </div>

        <!-- Restaurant Social Link -->
        <div class="my-2 inline-flex items-center justify-center">
          <!-- Restaurant LINE -->
          <div v-if="hasLineUrl" class="mt-2">
            <a
              target="_blank"
              :href="shopInfo.lineUrl"
              rel="noopener noreferrer"
            >
              <i class="fab fa-line mr-6 text-4xl" style="color: #4ec263"></i>
            </a>
          </div>

          <!-- Restaurant Instagram -->
          <div v-if="hasInstagramUrl" class="mt-2">
            <a
              target="_blank"
              :href="shopInfo.instagramUrl"
              rel="noopener noreferrer"
            >
              <i
                class="fab fa-instagram mr-6 text-4xl"
                style="color: #dd2a7b"
              ></i>
            </a>
          </div>

          <!-- Restaurant Uber Eats -->
          <div v-if="hasUberEatsUrl" class="mt-2">
            <a
              target="_blank"
              :href="shopInfo.uberEatsUrl"
              rel="noopener noreferrer"
            >
              <i><img src="/uber_eats_icon.svg" class="-ml-2 w-14" /></i>
            </a>
          </div>
        </div>

        <!-- Restaurant Hours -->
        <div class="mt-2">
          <div class="text-sm font-bold">
            {{ $t("shopInfo.hours") }}
          </div>

          <div class="mt-1">
            <template v-for="(day, key) in days" :key="key">
              <div
                class="flex rounded-sm px-2 py-1 text-sm"
                :class="
                  weekday == key % 7
                    ? isTodayTemporaryClosure
                      ? 'bg-red-700/10'
                      : 'bg-green-600/10'
                    : ''
                "
              >
                <div class="w-16">{{ $t("week.short." + day) }}</div>
                <div class="flex-1">
                  <template v-if="businessDay[key]">
                    <div
                      v-for="(data, dateKey) in openTimes[key]"
                      :key="dateKey"
                    >
                      <template v-if="validDate(data)">
                        {{ num2time(data.start) }} - {{ num2time(data.end) }}
                      </template>
                      <template v-if="shopInfo.enableLunchDinner">
                        <span v-if="dateKey === 0" class="font-bold">
                          :{{ $t("shopInfo.lunch") }}
                        </span>
                        <span v-if="dateKey === 1" class="font-bold">
                          :{{ $t("shopInfo.dinner") }}
                        </span>
                      </template>
                    </div>
                  </template>
                  <template v-else>{{ $t("shopInfo.closed") }}</template>
                </div>
                <div>
                  <template v-if="isOpen[key]">
                    <div
                      v-if="isTodayTemporaryClosure"
                      class="font-bold text-red-700"
                    >
                      {{ $t("shopInfo.temporaryClosure") }}
                    </div>
                    <div v-else class="font-bold text-green-600">Open</div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="mt-2">
          <div class="text-sm font-bold">
            {{ $t("shopInfo.paymentMethod") }}
          </div>

          <div class="mt-1 ml-1">
            <div class="text-sm">
              <span v-if="showPayment">{{ $t("shopInfo.onlinePayment") }}</span>
              <span v-if="showPayment && inStorePayment">/</span>
              <span v-if="inStorePayment">{{
                $t("shopInfo.onsitePayment")
              }}</span>
              <span v-if="!showPayment && !inStorePayment">
                <span v-if="shopInfo.publicFlag">{{
                  $t("shopInfo.noPaymentMethod")
                }}</span>
                <span v-else>{{ $t("shopInfo.notPublicShopMessage") }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="mt-2" v-if="inStorePayment && hasPaymentMethods">
          <div class="text-sm font-bold">
            {{ $t("shopInfo.paymentMethods") }}
          </div>
          <div class="mt-1 ml-1">
            <ul>
              <template v-for="(paymentMethod, k) in paymentMethods" :key="k">
                <li v-if="(shopInfo.paymentMethods || {})[paymentMethod.key]">
                  {{
                    $t(
                      "editRestaurant.paymentMethodChoices." +
                        paymentMethod.key,
                    )
                  }}
                </li>
              </template>
            </ul>
          </div>
        </div>

        <!-- Temporary Closure -->
        <div v-if="dispTemporaryClosure.length > 0" class="mt-2">
          <div class="text-sm font-bold">
            {{ $t("shopInfo.temporaryClosure") }}
          </div>

          <div class="mt-1 ml-1">
            <div
              v-for="(day, key) in dispTemporaryClosure"
              class="text-sm"
              :key="key"
            >
              {{ moment(day.toDate()).format("YYYY/MM/DD") }}
              {{
                $t(
                  "week.short." +
                    days[Number(moment(day.toDate()).format("e")) || 7],
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from "vue";
import moment from "moment";

import { daysOfWeek, paymentMethods } from "@/config/constant";
import { formatURL } from "@/utils/phoneutil";
import { ownPlateConfig, GAPIKey } from "@/config/project";
import { usePickupTime } from "@/utils/pickup";
import {
  isNull,
  useNationalPhoneNumber,
  validUrl,
  validLocation,
  validPlaceId,
  num2time,
} from "@/utils/utils";

import TransactionsAct from "@/app/user/TransactionsAct.vue";
import { RestaurantInfoData } from "@/models/RestaurantInfo";

import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    TransactionsAct,
  },
  props: {
    shopInfo: {
      type: Object as PropType<RestaurantInfoData>,
      required: true,
    },
    paymentInfo: {
      type: Object,
      required: true,
    },
    isDelivery: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["noAvailableTime"],
  setup(props, ctx) {
    const { locale, t } = useI18n({ useScope: "global" });

    const d = new Date();
    const moreInfo = ref(false);
    const weekday = d.getDay();
    const today = d;

    const mapWidth = computed(() => {
      // two rows
      if (window.innerWidth > 1024) {
        return 200;
      }
      if (window.innerWidth > 600) {
        return 150;
      }
      return 300;
    });

    const dispTemporaryClosure = computed(() => {
      const now = Date.now();
      return (props.shopInfo.temporaryClosure || []).filter((day) => {
        return day.seconds + 3600 * 24 > now / 1000;
      });
    });
    const isTodayTemporaryClosure = computed(() => {
      const res = dispTemporaryClosure.value.find((day) => {
        return (
          moment(day.toDate()).format("YYYYMMDD") ===
          moment().format("YYYYMMDD")
        );
      });
      return !!res;
    });

    const { parsedNumber, nationalPhoneNumber } = useNationalPhoneNumber(
      props.shopInfo,
    );

    const phoneUrl = computed(() => {
      const number = parsedNumber.value;
      if (number) {
        return formatURL(number);
      }
      return "";
    });

    const businessDay = computed(() => {
      return props.shopInfo.businessDay || {};
    });
    const openTimes = computed(() => {
      return props.shopInfo.openTimes;
    });

    const isOpen = computed(() => {
      return Object.keys(daysOfWeek).reduce(
        (tmpObj: { [key: string]: boolean }, day) => {
          if (weekday === Number(day) && businessDay.value[day]) {
            // get now and compaire
            const res = openTimes.value[day].reduce((tmpOpen, time) => {
              const now = today.getHours() * 60 + today.getMinutes();
              return tmpOpen || (now >= time.start && now <= time.end);
            }, false);
            tmpObj[day] = res;
          } else {
            tmpObj[day] = false;
          }
          return tmpObj;
        },
        {},
      );
    });
    const hasLocation = computed(() => {
      return (
        props.shopInfo.location &&
        props.shopInfo.location.lat &&
        props.shopInfo.location.lng &&
        validLocation(props.shopInfo.location || {}) &&
        validPlaceId(props.shopInfo.place_id)
      );
    });
    const hasUrl = computed(() => {
      return props.shopInfo.url && validUrl(props.shopInfo.url);
    });
    const hasLineUrl = computed(() => {
      return props.shopInfo.lineUrl && validUrl(props.shopInfo.lineUrl);
    });
    const hasInstagramUrl = computed(() => {
      return (
        props.shopInfo.instagramUrl && validUrl(props.shopInfo.instagramUrl)
      );
    });
    const hasUberEatsUrl = computed(() => {
      return props.shopInfo.uberEatsUrl && validUrl(props.shopInfo.uberEatsUrl);
    });
    const region = ownPlateConfig.region;

    const stripeAccount = computed(() => {
      return props.paymentInfo.stripe;
    });
    const showPayment = computed(() => {
      return stripeAccount.value;
    });
    const inStorePayment = computed(() => {
      return props.paymentInfo.inStore;
    });

    const shopPaymentMethods = computed(() => {
      return (
        Object.keys(props.shopInfo.paymentMethods || {}).filter((key) => {
          return !!(props.shopInfo.paymentMethods || {})[key];
        }) || []
      );
    });
    const hasPaymentMethods = computed(() => {
      return shopPaymentMethods.value.length > 0;
    });

    const {
      deliveryAvailableDays,
      availableDays,
      temporaryClosure,
      todaysLast,
      deliveryTodaysLast,
    } = usePickupTime(props.shopInfo, {}, ref({}));

    const lastTime = computed(() => {
      return props.isDelivery ? deliveryTodaysLast.value : todaysLast.value;
    });
    const minimumAvailableTime = computed(() => {
      const days = props.isDelivery
        ? deliveryAvailableDays.value
        : availableDays.value;
      const time = days[0]?.times[0]?.display;
      const date = days[0]?.date;
      console.log(locale.value);
      moment.locale(locale.value as string);
      if (!isNull(time) && !isNull(date)) {
        ctx.emit("noAvailableTime", false);
        return [moment(date).format("MM/DD (ddd)"), time].join(" ");
      } else {
        ctx.emit("noAvailableTime", true);
        return t("shopInfo.noAvailableTime");
      }
    });
    const mapQuery = computed(() => {
      return (
        "https://www.google.com/maps/search/?api=1&query=" +
        props.shopInfo.location.lat +
        "," +
        props.shopInfo.location.lng +
        "&query_place_id=" +
        props.shopInfo.place_id
      );
    });

    const mapImage = computed(() => {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${props.shopInfo.location.lat},${props.shopInfo.location.lng}&zoom=16&size=800x${mapWidth.value}&scale=2&maptype=roadmap&markers=color:red%7Clabel:G%7C${props.shopInfo.location.lat},${props.shopInfo.location.lng}&key=${GAPIKey}`;
    });

    const toggleMoreInfo = () => {
      moreInfo.value = !moreInfo.value;
    };
    const validDate = (date: any) => {
      return !isNull(date.start) && !isNull(date.end);
    };

    return {
      moreInfo,
      days: daysOfWeek,
      weekday,
      today,

      // computed
      mapWidth,
      dispTemporaryClosure,
      isTodayTemporaryClosure,
      phoneUrl,
      nationalPhoneNumber,
      isOpen,
      hasLocation,
      hasUrl,
      hasLineUrl,
      hasInstagramUrl,
      hasUberEatsUrl,
      region,
      showPayment,
      stripeAccount,
      inStorePayment,

      shopPaymentMethods,
      hasPaymentMethods,
      paymentMethods,

      minimumAvailableTime,
      lastTime,
      mapQuery,
      mapImage,
      // methods
      toggleMoreInfo,
      validDate,

      num2time,
      //
      temporaryClosure,

      moment,

      businessDay,
      openTimes,
    };
  },
});
</script>
