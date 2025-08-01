<template>
  <div>
    <a
      class="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-black/5 px-3"
      @click="openNotificationSettings()"
    >
      <i class="material-icons text-op-teal xs:mr-1 text-lg">notifications</i>
      <div
        class="text-op-teal xs:visible xs:mr-2 invisible -mr-2 text-sm font-bold"
      >
        {{ $t("admin.order.notification") }}
      </div>

      <div class="mr-1 font-bold text-red-700">{{ orderCounter }}</div>
      <div
        v-if="notificationData.soundOn"
        class="mt-1 inline-flex items-center justify-center space-x-1"
      >
        <div>
          <i class="material-icons -mr-1 text-lg text-green-600">volume_up</i>
        </div>
        <div>
          <div v-if="notificationData.infinityNotification">
            <i class="material-icons text-lg text-green-600">repeat</i>
          </div>
          <div v-else>
            <i class="material-icons text-lg text-green-600">looks_one</i>
          </div>
        </div>
      </div>
      <div v-else>
        <i class="material-icons text-lg text-red-700">volume_off</i>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onUnmounted } from "vue";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase/firebase9";
import { useStore } from "vuex";
import { useRestaurantId } from "@/utils/utils";

export default defineComponent({
  emits: ["openNotificationSettings"],
  setup(props, ctx) {
    const store = useStore();

    const restaurantId = useRestaurantId();
    const notificationData = ref({});
    const detacher = onSnapshot(
      doc(db, `restaurants/${restaurantId.value}/private/notifications`),
      (notification) => {
        notificationData.value = notification.data() ?? {};
      },
    );
    onUnmounted(() => {
      detacher();
    });
    const openNotificationSettings = () => {
      ctx.emit("openNotificationSettings");
    };
    const orderCounter = computed(() => {
      return Object.keys(store.state.orderObj).reduce((tmp, key) => {
        const count = (store.state.orderObj[key] || []).length;
        return tmp + count;
      }, 0);
    });
    return {
      notificationData,
      openNotificationSettings,
      orderCounter,
    };
  },
});
</script>
