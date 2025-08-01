<template>
  <div v-if="enable === null || isLoading === true">loading...</div>

  <div v-else>
    <!-- Header -->
    <div class="mx-6 mt-4 lg:flex lg:items-center">
      <!-- Back and Preview -->
      <div class="flex space-x-4">
        <back-button url="/admin/restaurants/" />
      </div>

      <!-- Title -->
      <div class="mt-4 lg:mx-4 lg:mt-0 lg:flex lg:flex-1 lg:items-center">
        <span class="text-base text-xl font-bold">
          {{ $t("admin.smaregi.index") }}
        </span>
      </div>
    </div>

    <div class="mx-6 mt-4">
      <div v-if="enable === false">
        <a
          :href="authUrl"
          class="border-op-teal inline-flex h-12 items-center rounded-full border-2 px-6"
        >
          <span class="text-op-teal text-base font-bold">連携する</span>
        </a>
      </div>
      <div v-if="enable === true">
        <span class="text-base text-xl font-bold">
          {{ $t("admin.smaregi.smaregiShopList") }}
        </span>
        <div v-if="isEdit">
          <div
            v-for="(shop, k) in shopList"
            :key="k"
            class="mt-2 rounded-lg bg-black/5"
          >
            <div class="pt-4 pl-4">スマレジ登録店舗：{{ shop.storeName }}</div>
            <div class="pt-2 pl-4">
              連携する店舗：
              <o-select
                v-model="selectedRestaurant[k]"
                :class="
                  selectedRestaurant[k] &&
                  duplicateElement[selectedRestaurant[k]]
                    ? 'border-2 border-solid border-red-700'
                    : ''
                "
              >
                <option
                  v-for="restaurant in restaurants"
                  :value="restaurant.id"
                  :key="restaurant.id"
                >
                  {{ restaurant.restaurantName }}
                </option>
              </o-select>
            </div>

            <div class="pt-1 pl-4">
              在庫切れしきい値:
              <o-select v-model="outOfStockData[k]">
                <option
                  v-for="threshold in outOfStockThresholds"
                  :value="threshold.value"
                  :key="threshold.value"
                >
                  {{ threshold.name }}
                </option>
              </o-select>
            </div>

            <div class="pt-1 pb-4 pl-4">
              在庫復活しきい値:
              <o-select v-model="inStockData[k]">
                <option
                  v-for="threshold in inStockThresholds"
                  :value="threshold.value"
                  :key="threshold.value"
                >
                  {{ threshold.name }}
                </option>
              </o-select>
            </div>
          </div>
          <div v-if="isDuplicateError">*お店の指定が重複しています</div>
          <div class="mt-4">
            <button @click="saveShops" :disabled="isDuplicateError">
              <div
                class="bg-op-teal inline-flex h-12 min-w-32 items-center justify-center rounded-full px-6 shadow-sm"
              >
                <span class="text-base font-bold text-white">{{
                  $t("editCommon.save")
                }}</span>
              </div>
            </button>
          </div>
        </div>

        <div v-else>
          <div
            v-for="(shop, k) in shopList"
            :key="k"
            class="mt-2 rounded-lg bg-black/5"
          >
            <div class="pt-4 pl-4">
              <div class="text-base">
                スマレジ登録店舗：
                <router-link :to="`/admin/smaregi/store/${shop.storeId}`">
                  <span class="font-bold">{{ shop.storeName }}</span>
                </router-link>
              </div>
            </div>
            <div class="pl-4">
              連携店舗：{{
                (restaurantObj[selectedRestaurant[k]] || {}).restaurantName
              }}
            </div>
            <div class="pb-4 pl-4">
              在庫切れしきい値：
              {{ showStockThreshold((outOfStockData || {})[k]) }} /
              在庫復活しきい値：{{ showStockThreshold((inStockData || {})[k]) }}
            </div>
          </div>
          <div class="mt-4">
            <button @click="isEdit = true">
              <div
                class="bg-op-teal inline-flex h-12 min-w-32 items-center justify-center rounded-full px-6 shadow-sm"
              >
                <span class="text-base font-bold text-white">{{
                  $t("editCommon.edit")
                }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import { smaregi } from "@/config/project";
import { db } from "@/lib/firebase/firebase9";
import { smaregiStoreList } from "@/lib/firebase/functions";

import { doc2data, useAdminUids, defaultTitle } from "@/utils/utils";

import BackButton from "@/components/BackButton.vue";

import {
  doc,
  getDocs,
  query,
  collection,
  where,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { useHead } from "@unhead/vue";

const outOfStockThresholds = [
  { value: 999999, name: "なし" },
  { value: 0, name: "0" },
  { value: 1, name: "1" },
  { value: 2, name: "2" },
  { value: 3, name: "3" },
  { value: 4, name: "4" },
  { value: 5, name: "5" },
  { value: 10, name: "10" },
  { value: 20, name: "20" },
];

const inStockThresholds = [
  { value: 999999, name: "なし" },
  { value: 50, name: "50" },
  { value: 20, name: "20" },
  { value: 10, name: "10" },
  { value: 5, name: "5" },
  { value: 4, name: "4" },
  { value: 3, name: "3" },
];

export default defineComponent({
  components: {
    BackButton,
  },
  name: "Restaurant",
  setup() {
    const authUrl = `${smaregi.authUrl}?response_type=code&client_id=${smaregi.clientId}&scope=openid+email+offline_access`;
    const enable = ref<boolean | null>(null);

    const shopList = ref<any[]>([]);
    const isLoading = ref(false);

    const selectedRestaurant = ref<any>({});
    const restaurants = ref<any[]>([]);

    const restaurantObj = ref<any>({});
    const isEdit = ref(false);

    const inStockData = ref<{ [key: string]: number }>({});
    const outOfStockData = ref<{ [key: string]: number }>({});

    // internal
    let contractId: string | null = null;

    useHead(() => ({
      title: [defaultTitle, "Admin Smaregi Index"].join(" / "),
    }));

    const { uid } = useAdminUids();
    // computed
    const duplicateElement = computed(() => {
      const counter = Object.values(selectedRestaurant.value).reduce(
        (tmp: { [key: string]: number }, ele: any) => {
          if (ele === "00000") {
            return tmp;
          }
          if (tmp[ele] === undefined) {
            tmp[ele] = 1;
          } else {
            tmp[ele] += 1;
          }
          return tmp;
        },
        {},
      );
      return Object.keys(counter).reduce(
        (tmp: { [key: string]: boolean }, key: any) => {
          if (counter[key] > 1) {
            tmp[key] = true;
          }
          return tmp;
        },
        {},
      );
    });
    const isDuplicateError = computed(() => {
      return Object.keys(duplicateElement.value).length > 0;
    });

    getDoc(doc(db, `admins/${uid.value}/private/smaregi`)).then(
      async (smaregiDoc) => {
        enable.value = smaregiDoc && smaregiDoc.exists();

        if (enable.value) {
          const smaregiData = smaregiDoc.data();
          contractId = smaregiData?.smaregi?.contract?.id;

          try {
            isLoading.value = true;
            const { data } = await smaregiStoreList({});
            shopList.value = data.res;
            // console.log("smaregiStoreList", data);
          } finally {
            isLoading.value = false;
          }
          const restaurantColleciton = await getDocs(
            query(
              collection(db, "restaurants"),
              where("publicFlag", "==", true),
              where("deletedFlag", "==", false),
              where("uid", "==", uid.value),
            ),
          );
          restaurants.value = restaurantColleciton.docs
            .map(doc2data("message"))
            .sort((a, b) => {
              return a.restaurantName > b.restaurantName ? 1 : -1;
            });
          restaurantObj.value = restaurants.value.reduce((tmp, current) => {
            tmp[current.id] = current;
            return tmp;
          }, {});

          restaurants.value.unshift({
            id: "00000",
            restaurantName: "-----------------",
          });

          const storeCollection = await getDocs(
            query(
              collection(db, `/smaregi/${contractId}/stores`),
              where("uid", "==", uid.value),
            ),
          );
          const stores = storeCollection.docs.map(doc2data("stores"));

          const storeObj = stores.reduce((tmp, current) => {
            tmp[current.storeId] = current;
            return tmp;
          }, {});

          const __selectedRestaurant: any = {};
          (shopList.value || []).forEach((store, key) => {
            const storeId = store.storeId;
            if (storeObj[storeId]) {
              const { outOfStock, inStock } = storeObj[storeId];
              __selectedRestaurant[key] = storeObj[storeId].restaurantId;

              outOfStockData.value[key] =
                outOfStock === undefined ? 999999 : outOfStock;
              inStockData.value[key] = inStock === undefined ? 999999 : inStock;
            }
          });
          selectedRestaurant.value = __selectedRestaurant;
        }
      },
    );

    const saveShops = () => {
      if (isDuplicateError.value) {
        console.log("error");
        return;
      }

      (shopList.value || []).forEach((store, key) => {
        const restaurantId = selectedRestaurant.value[key];
        const outOfStock = outOfStockData.value[key];
        const inStock = inStockData.value[key];
        // check uniq.
        const storeId = store.storeId;
        const path = `/smaregi/${contractId}/stores/${storeId}`;

        if (restaurantId && restaurantId !== "00000") {
          const data = {
            storeName: store.storeName,
            contractId,
            storeId,
            uid: uid.value,
            restaurantId,
          } as any;
          if (outOfStock !== 999999 && outOfStock !== undefined) {
            data.outOfStock = outOfStock;
          }
          if (inStock !== 999999 && inStock !== undefined) {
            data.inStock = inStock;
          }
          setDoc(doc(db, path), data);
          // console.log(selectedRestaurant.value[key]);
        } else {
          deleteDoc(doc(db, path));
          console.log("TODO DELETE");
        }
      });
      isEdit.value = false;
    };
    const showStockThreshold = (value: any) => {
      if (value === undefined || value === 999999) {
        return "----";
      }
      return value;
    };

    return {
      // const
      outOfStockThresholds,
      inStockThresholds,

      authUrl,
      enable,

      shopList,
      isLoading,

      selectedRestaurant,
      restaurants,

      restaurantObj,
      isEdit,

      inStockData,
      outOfStockData,

      //
      duplicateElement,
      isDuplicateError,
      saveShops,
      showStockThreshold,
    };
  },
});
</script>
