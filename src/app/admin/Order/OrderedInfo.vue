<template>
  <div>
    <!-- For Admin -->
    <div
      v-if="!order.restaurantId"
      @click="$emit('selected', order)"
      class="cursor-pointer rounded-lg bg-white shadow-sm"
    >
      <!-- Order Status -->
      <div class="p-2">
        <OrderState
          :orderState="statusKey"
          class="rounded-sm p-1 text-center text-xs font-bold"
        >
          {{ $t("order.status." + convOrderStateForText(statusKey, order)) }}
        </OrderState>
      </div>

      <!-- Payment Status and Time Stamp -->
      <div class="flex items-center px-2">
        <div class="flex-1 text-xs font-bold">
          <StripeStatus :stripeState="order.payment.stripe" v-if="hasStripe">
            {{ $t("order.status.stripe_" + order.payment.stripe) }}
          </StripeStatus>
          <div v-else class="text-yellow-500">
            {{ $t("order.status.onsitePayment") }}
          </div>
        </div>

        <div class="text-right text-xs">
          {{ timestamp || "0:00pm" }}
        </div>
      </div>

      <!-- Order ID and User Name/Phone -->
      <div class="flex items-center px-2 pt-2">
        <div class="text-xl font-bold">
          {{ orderName }}
        </div>

        <div class="flex-1 text-right text-base">
          <div v-if="order.name">
            <i
              class="fab fa-line mr-2 text-lg"
              style="color: #4ec263"
              v-if="order.isLiff"
            />
            {{ order.name }}
          </div>

          <div v-else-if="phoneNumber">
            {{ nationalPhoneNumber }}
          </div>

          <div v-else>
            <i
              class="fab fa-line mr-2 text-lg"
              style="color: #4ec263"
              v-if="order.isLiff"
            />
            LINE
          </div>
        </div>
      </div>

      <!-- Order Count, Total, and Tip -->
      <div class="flex items-center p-2">
        <div class="mr-2 text-sm">
          {{ $t("sitemenu.orderCounter", { count: totalCount }, totalCount) }}
        </div>

        <div class="mr-2 text-sm">
          {{ $n(order.totalCharge, "currency") }}
        </div>

        <div
          class="mr-2 items-center justify-center rounded-md bg-yellow-500/10 p-1 text-xs font-bold text-yellow-500"
          v-if="hasStripe && order.payment.stripe !== 'canceled'"
        >
          {{ $t("admin.order.cardPayment") }}
        </div>

        <div
          class="mr-2 items-center justify-center rounded-md bg-red-700/10 p-1 text-xs font-bold text-red-700"
          v-else
        >
          {{ $t("admin.order.storePayment") }}
        </div>

        <div
          class="mr-2 items-center justify-center rounded-md bg-green-600/10 p-1 text-xs font-bold text-green-600"
          v-if="order.promotionId"
        >
          {{ $n(Number(order.discountPrice || 0), "currency")
          }}{{ $t("order.discountPriceSuffix") }}
        </div>

        <div class="mr-2 text-sm" v-if="order.isDelivery">
          <i class="material-icons"> delivery_dining </i>
        </div>
        <div class="mr-2 text-sm text-green-600" v-if="order.isPickup">
          <i class="material-icons"> local_mall </i>
        </div>

        <div
          v-if="order.tip"
          class="flex-1 text-right text-xs font-bold text-blue-500"
        >
          {{ $t("order.includingTip") }} {{ $n(order.tip, "currency") }}
        </div>
      </div>
    </div>

    <!-- For User -->
    <div
      v-else-if="restaurant"
      @click="$emit('selected', order)"
      class="cursor-pointer rounded-lg bg-white shadow-sm"
    >
      <!-- Order Status -->
      <div class="p-2">
        <OrderState
          :orderState="statusKey"
          class="rounded-sm p-1 text-center text-xs font-bold"
        >
          {{ $t("order.status." + convOrderStateForText(statusKey, order)) }}
        </OrderState>
      </div>

      <!-- Payment Status and Time Stamp -->
      <div class="flex items-center px-2">
        <div class="flex-1 text-xs font-bold">
          <StripeStatus :stripeState="order.payment.stripe" v-if="hasStripe">
            {{ $t("order.status.stripe_" + order.payment.stripe) }}
          </StripeStatus>
          <div v-else class="text-yellow-500">
            {{ $t("order.status.onsitePayment") }}
          </div>
        </div>

        <div class="text-right text-xs">
          {{ timestamp }}
        </div>
      </div>

      <!-- Restaurant Photo and Name, Order Count, Total, and Order ID -->
      <div class="flex items-center p-2">
        <div class="mr-2">
          <img
            :src="resizedProfileImage(restaurant, '600')"
            class="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <div class="flex-1">
          <div class="text-base">
            {{ restaurant.restaurantName }}
          </div>

          <div class="flex items-center">
            <div class="mr-2 text-sm">
              {{
                $t(
                  "sitemenu.orderCounter",
                  {
                    count: totalCount,
                  },
                  totalCount,
                )
              }}
            </div>

            <div class="mr-2 text-sm">
              {{ $n(order.totalCharge, "currency") }}
            </div>
            <div
              class="mr-2 items-center justify-center rounded-md bg-green-600/10 p-1 text-xs font-bold text-green-600"
              v-if="order.promotionId && isSuperView"
            >
              {{ $n(Number(order.discountPrice || 0), "currency")
              }}{{ $t("order.discountPriceSuffix") }}
            </div>
            <div class="mr-2 text-sm" v-if="order.isDelivery">
              <i class="material-icons"> delivery_dining </i>
            </div>

            <div class="flex-1 text-right text-sm font-bold">
              {{ orderName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="rounded-lg bg-white shadow-sm">
      <!-- Order Status -->
      <div class="p-2">
        <OrderState
          :orderState="statusKey"
          class="rounded-sm p-1 text-center text-xs font-bold"
        >
          {{ $t("order.status." + convOrderStateForText(statusKey, order)) }}
        </OrderState>
      </div>

      <!-- Payment Status and Time Stamp -->
      <div class="flex items-center px-2">
        <div class="flex-1 text-xs font-bold">
          <StripeStatus :stripeState="order.payment.stripe" v-if="hasStripe">
            {{ $t("order.status.stripe_" + order.payment.stripe) }}
          </StripeStatus>
          <div v-else class="text-yellow-500">
            {{ $t("order.status.onsitePayment") }}
          </div>
        </div>

        <div class="text-right text-xs">
          {{ timestamp }}
        </div>
      </div>

      <!-- Restaurant Photo and Name, Order Count, Total, and Order ID -->
      <div class="flex items-center p-2">
        <div class="flex-1">
          <div class="text-base">
            {{ $t("order.closedRestaurant") }}
          </div>

          <div class="flex items-center">
            <div class="mr-2 text-sm">
              {{
                $t(
                  "sitemenu.orderCounter",
                  {
                    count: totalCount,
                  },
                  totalCount,
                )
              }}
            </div>

            <div class="mr-2 text-sm">
              {{ $n(order.totalCharge, "currency") }}
            </div>
            <div class="mr-2 text-sm" v-if="order.isDelivery">
              <i class="material-icons"> delivery_dining </i>
            </div>

            <div class="flex-1 text-right text-sm font-bold">
              {{ orderName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";

import { nameOfOrder } from "@/utils/strings";
import { parsePhoneNumber, formatNational } from "@/utils/phoneutil";

import { db } from "@/lib/firebase/firebase9";
import { doc, getDoc } from "firebase/firestore";

import { order_status_keys } from "@/config/constant";
import {
  arrayOrNumSum,
  convOrderStateForText,
  resizedProfileImage,
} from "@/utils/utils";
import { useI18n } from "vue-i18n";

import { OrderInfoData } from "@/models/orderInfo";
import { RestaurantInfoData } from "@/models/RestaurantInfo";
import OrderState from "@/components/OrderStatus.vue";
import StripeStatus from "@/components/StripeStatus.vue";

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<OrderInfoData>,
      required: true,
    },
    isSuperView: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    OrderState,
    StripeStatus,
  },
  emits: ["selected"],
  setup(props) {
    const { d } = useI18n({ useScope: "global" });

    const restaurant = ref<RestaurantInfoData | null>(null);
    if (props.order.restaurantId) {
      getDoc(doc(db, `restaurants/${props.order.restaurantId}`))
        .then((snapshot) => {
          restaurant.value = snapshot.data() as RestaurantInfoData;
        })
        .catch(() => {
          console.log("no restaurant");
        });
    }

    const statusKey = computed(() => {
      return order_status_keys[props.order.status];
    });
    const hasStripe = computed(() => {
      return props.order?.payment?.stripe;
    });
    const timestamp = computed(() => {
      const time = props.order.timeEstimated || props.order.timePlaced;

      if (props.isSuperView) {
        return d(time, "long");
      } else {
        return d(time, "time");
      }
    });
    const phoneNumber = computed(() => {
      return props.order.phoneNumber
        ? parsePhoneNumber(props.order.phoneNumber)
        : "";
    });
    const nationalPhoneNumber = computed(() => {
      return phoneNumber.value === "" ? "" : formatNational(phoneNumber.value);
    });
    const orderName = computed(() => {
      return nameOfOrder(props.order);
    });
    const totalCount = computed(() => {
      if (props.order.order) {
        return Object.values(props.order.order).reduce((count, order) => {
          return count + arrayOrNumSum(order);
        }, 0);
      }
      return 0;
    });

    return {
      restaurant,
      statusKey,
      hasStripe,
      timestamp,
      phoneNumber,
      nationalPhoneNumber,
      orderName,
      totalCount,

      convOrderStateForText,
      resizedProfileImage,
    };
  },
});
</script>
