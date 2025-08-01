<template>
  <div v-if="$store.getters.uidAdmin">
    <!-- Partnets -->
    <Partners :shopOwner="shopOwner" v-if="shopOwner" />

    <!-- Welcome and Link -->
    <WelcomeAndLinks />

    <EmailVerify v-if="!emailVerified" />

    <!-- News -->
    <News />

    <!-- News -->
    <Survey v-if="false" />

    <!-- Unset Warning -->
    <div v-if="false" class="mx-6 mt-4 rounded-lg bg-red-700/10 p-4">
      <span class="text-sm text-red-700">{{
        $t("admin.payments.unsetWarning")
      }}</span>
    </div>

    <!-- 5 steps warning -->
    <div
      v-if="isOwner && showFiveSteps"
      class="mx-6 mt-4 rounded-lg bg-red-700/10 p-4"
    >
      <div>
        <span class="text-sm font-bold text-red-700">
          店舗を公開するまでの５ステップ
        </span>
      </div>
      <ul class="list-decimal">
        <ol>
          1.お支払い方法を選択してください。
          <a href="#paymentSection" v-if="unsetPaymentWarning" class="underline"
            >支払い方法の設定はこちら。</a
          >
          <img src="@/assets/images/sumi-1.svg" class="w-6" v-else />
        </ol>
        <ol>
          2.飲食店を追加して、店舗の情報を入力してください。
          <a href="#addRestaurant" v-if="!existsRestaurant" class="underline"
            >飲食店の追加はこちら。</a
          >
          <img src="@/assets/images/sumi-1.svg" class="w-6" v-else />
        </ol>
        <ol>
          3.メニューを２つ以上登録してください。
          <a href="#addMenu" v-if="!existMenu" class="underline"
            >メニュー追加はこちらの「メニュー」から。</a
          >
          <img src="@/assets/images/sumi-1.svg" class="w-6" v-else />
        </ol>
        <ol>
          4.店舗を「公開」にしてください。
          <a href="#addMenu" v-if="!existPublicRestaurant" class="underline"
            >公開への設定変更は「店情報の変更」から。</a
          >
          <img src="@/assets/images/sumi-1.svg" class="w-6" v-else />
        </ol>
        <ol>
          5.リストの掲載の申請をしてください。(オプション)
        </ol>
      </ul>
    </div>

    <!-- Messages -->
    <div
      class="mx-6 mt-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12"
      v-if="messages.length > 0"
    >
      <div>
        <div class="pb-2">
          <span class="mb-2 text-xl font-bold text-black/40">
            {{ $t("admin.messages.title") }}
          </span>
        </div>
        <div
          v-for="(message, k) in messages"
          :key="k"
          class="border-op-teal rounded-lg border-2 border-solid p-6"
        >
          <MessageCard :message="message" />
        </div>
      </div>
    </div>

    <div class="mx-6 mt-2 lg:text-center">
      <ToggleSwitch
        :toggleState="simpleMode"
        @toggleFunction="switchSimpleMode()"
        onName="admin.index.showSimple"
        offName="admin.index.showAll"
      />
    </div>

    <!-- Restaurants and Right Settin Section -->
    <div class="mx-6 mt-2 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
      <!-- Restaurants -->
      <div>
        <div class="pb-2">
          <span class="mb-2 text-xl font-bold text-black/40">
            {{ $t("admin.restaurant") }}
          </span>
        </div>

        <div v-if="readyToDisplay">
          <!-- No Restaurant -->
          <div v-if="existsRestaurant === null"></div>
          <div v-else-if="!existsRestaurant">
            <div
              class="rounded-lg border-2 border-solid border-red-700 bg-white p-6"
            >
              <a name="addRestaurant" />
              <div class="text-op-teal text-center text-base font-bold">
                {{ $t("admin.addYourRestaurant") }}
              </div>

              <div class="mt-4 text-center">
                <button @click="handleNew" class="cursor-pointer">
                  <div
                    class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
                  >
                    <i class="material-icons text-op-teal mr-2 text-lg">add</i>
                    <span class="text-op-teal text-sm font-bold">{{
                      $t("admin.addNewRestaurant")
                    }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Existing Restaurant -->
          <div v-if="existsRestaurant">
            <!-- All Orders -->
            <div v-if="isOwner && restaurantLists.length > 1" class="mb-2">
              <router-link to="/admin/orders">
                <div
                  class="text-op-teal flex h-14 items-center justify-center rounded-full bg-black/5 px-4"
                >
                  <span class="text-base font-bold">{{
                    $t("admin.viewAllOrders")
                  }}</span>
                </div>
              </router-link>
            </div>

            <a name="addMenu" />
            <div
              v-for="(restaurantId, index) in restaurantLists"
              :key="restaurantId"
            >
              <a :id="'restaurant_' + restaurantId" />
              <restaurant
                v-if="restaurantItems[restaurantId]"
                :simpleMode="simpleMode"
                :shopInfo="restaurantItems[restaurantId]"
                :restaurantid="restaurantId"
                :numberOfMenus="
                  restaurantItems[restaurantId].numberOfMenus || 0
                "
                :numberOfOrders="numberOfOrderObj[restaurantId] || 0"
                :lineEnable="lines[restaurantId] || false"
                :shopOwner="shopOwner"
                :position="
                  index == 0
                    ? 'first'
                    : restaurantLists.length - 1 === index
                      ? 'last'
                      : ''
                "
                @positionUp="positionUp($event)"
                @positionDown="positionDown($event)"
                @deleteFromRestaurantLists="deleteFromRestaurantLists($event)"
                :isOwner="isOwner"
              />
            </div>

            <!-- Add Restaurant -->
            <div v-if="existsRestaurant && isOwner" class="mt-4 text-center">
              <button @click="handleNew" class="cursor-pointer">
                <div
                  class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
                >
                  <i class="material-icons text-op-teal mr-2 text-lg">add</i>
                  <span class="text-op-teal text-sm font-bold">{{
                    $t("admin.addNewRestaurant")
                  }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="mt-2 lg:mt-0" v-if="isOwner">
        <a name="paymentSection" />
        <!-- Payment -->
        <payment-section @updateUnsetWarning="updateUnsetWarning($event)" />

        <!-- SubAccounts -->
        <div class="mt-2">
          <SubAccount />
        </div>

        <!-- Note -->
        <Note />

        <!-- Mail Magazine-->
        <MailMagazine />

        <!-- Smaregi-->
        <Smaregi />
      </div>
      <!-- End of Right Section -->
    </div>
    <div class="bg-ownplate-yellow mt-2 p-4">
      <!-- Footer -->
      <IndexFooter />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, onMounted } from "vue";

import { db } from "@/lib/firebase/firebase9";
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  collectionGroup,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";

import { order_status } from "@/config/constant";
import { midNight } from "@/utils/dateUtils";

import ToggleSwitch from "@/components/ToggleSwitch.vue";

import Restaurant from "@/app/admin/Index/Restaurant.vue";
import PaymentSection from "@/app/admin/Index/PaymentSection.vue";
import MessageCard from "@/app/admin/Messages/MessageCard.vue";

import EmailVerify from "@/app/admin/Index/EmailVerify.vue";
import WelcomeAndLinks from "@/app/admin/Index/WelcomeAndLinks.vue";
import News from "@/app/admin/Index/News.vue";
import Survey from "@/app/admin/Index/Survey.vue";
import Note from "@/app/admin/Index/Note.vue";
import MailMagazine from "@/app/admin/Index/MailMagazine.vue";
import Smaregi from "@/app/admin/Index/Smaregi.vue";
import IndexFooter from "@/app/admin/Index/Footer.vue";
import Partners from "@/app/admin/Index/Partners.vue";
import SubAccount from "@/app/admin/Index/SubAccount.vue";

import { ping } from "@/lib/firebase/functions";

import {
  getShopOwner,
  doc2data,
  sleep,
  scrollToElementById,
  arrayChunk,
  useAdminUids,
  defaultTitle,
} from "@/utils/utils";
import { checkAdminPermission } from "@/utils/userPermission";

import { useAdminConfigToggle } from "@/utils/admin/Toggle";

import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { RestaurantInfoData } from "@/models/RestaurantInfo";
import { ShopOwnerData } from "@/models/ShopOwner";
import { useHead } from "@unhead/vue";

export default defineComponent({
  name: "RestaurantIndex",
  components: {
    PaymentSection,
    Restaurant,
    MessageCard,
    WelcomeAndLinks,
    News,
    Survey,
    Partners,
    EmailVerify,
    Smaregi,
    SubAccount,
    MailMagazine,
    Note,
    IndexFooter,
    ToggleSwitch,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const readyToDisplay = ref(false);
    const restaurantItems = ref<{ [key: string]: RestaurantInfoData } | null>(
      null,
    );
    const orderDetachers = ref<Unsubscribe[]>([]);
    const restaurant_detacher = ref<Unsubscribe | null>(null);
    const message_detacher = ref<Unsubscribe | null>(null);
    const unsetPaymentWarning = ref(false);
    const lines = ref<{ [key: string]: boolean }>({});
    const shopOwner = ref<ShopOwnerData | Record<string, never> | null>(null);
    const restaurantLists = ref<string[]>([]);
    const numberOfOrderObj = ref<{ [key: string]: number }>({});
    const messages = ref<DocumentData[]>([]);

    useHead(() => ({
      title: ["Admin Index", defaultTitle].join(" / "),
    }));

    if (!checkAdminPermission()) {
      return;
    }
    ping({
      restaurantId: "index",
      operationType: "index",
      pathName: location.pathname,
    });

    const detachOrders = () => {
      orderDetachers.value.forEach((detacher) => {
        detacher();
      });
      orderDetachers.value = [];
    };
    const { isOwner, uid, ownerUid, emailVerified } = useAdminUids();
    const { toggle: simpleMode, switchToggle: switchSimpleMode } =
      useAdminConfigToggle("simpleMode", uid.value, false);

    const watchOrder = () => {
      detachOrders();
      orderDetachers.value = Object.keys(restaurantItems.value || {}).map(
        (restaurantId) => {
          return onSnapshot(
            query(
              collection(db, `restaurants/${restaurantId}/orders`),
              where("timePlaced", ">=", midNight()),
            ),
            // IDEALLY: .where("status", "<", order_status.ready_to_pickup)
            (result) => {
              const newObj = { ...numberOfOrderObj.value };
              newObj[restaurantId] = result.docs
                .map((orderDoc) => orderDoc.data())
                .filter((data) => {
                  // We need this filter here because Firebase does not allow us to do
                  return (
                    data.status < order_status.ready_to_pickup &&
                    data.status !== order_status.waiting_payment
                  );
                }).length;
              numberOfOrderObj.value = newObj;
            },
          );
        },
      );
    };
    onMounted(async () => {
      try {
        shopOwner.value = isOwner.value
          ? await getShopOwner(ownerUid.value)
          : {};

        restaurantLists.value = await (async () => {
          if (isOwner.value) {
            const restaurantListsDoc = await getDoc(
              doc(db, `/admins/${uid.value}/public/RestaurantLists`),
            );
            return restaurantListsDoc.exists()
              ? restaurantListsDoc.data().lists || []
              : [];
          } else {
            const restaurantListsDoc = await getDoc(
              doc(db, `/admins/${ownerUid.value}/children/${uid.value}`),
            );
            return restaurantListsDoc.exists()
              ? restaurantListsDoc.data().restaurantLists || []
              : [];
          }
        })();

        if (isOwner.value) {
          restaurant_detacher.value = onSnapshot(
            query(
              collection(db, "restaurants"),
              where("uid", "==", ownerUid.value),
              where("deletedFlag", "==", false),
              orderBy("createdAt", "asc"),
            ),
            (result) => {
              try {
                if (result.empty) {
                  restaurantItems.value = {}; // so that we present "No restaurant"
                  return;
                }
                restaurantItems.value = (result.docs || []).reduce(
                  (
                    tmp: { [key: string]: RestaurantInfoData },
                    restaurantDoc: DocumentSnapshot<DocumentData>,
                  ) => {
                    tmp[restaurantDoc.id] = doc2data("restaurant")(
                      restaurantDoc,
                    ) as RestaurantInfoData;
                    if (!restaurantLists.value.includes(restaurantDoc.id)) {
                      restaurantLists.value.push(restaurantDoc.id);
                    }
                    return tmp;
                  },
                  {},
                );
                watchOrder();
              } catch (error) {
                console.log("Error fetch doc,", error);
              } finally {
                readyToDisplay.value = true;
              }
            },
          );
        }
        if (!isOwner.value && restaurantLists.value.length > 0) {
          // sub account
          arrayChunk(restaurantLists.value, 10).forEach((restaurantIds) => {
            restaurant_detacher.value = onSnapshot(
              query(
                collection(db, "restaurants"),
                where("uid", "==", ownerUid.value),
                where("restaurantId", "in", restaurantIds),
                where("deletedFlag", "==", false),
                orderBy("createdAt", "asc"),
              ),
              (result) => {
                try {
                  if (result.empty && restaurantItems.value === null) {
                    restaurantItems.value = {}; // so that we present "No restaurant"
                    return;
                  }

                  restaurantItems.value = (result.docs || []).reduce(
                    (
                      tmp: { [key: string]: RestaurantInfoData },
                      restaurantDoc: DocumentSnapshot<DocumentData>,
                    ) => {
                      tmp[restaurantDoc.id] = doc2data("restaurant")(
                        restaurantDoc,
                      ) as RestaurantInfoData;
                      return tmp;
                    },
                    {},
                  );
                  // if subAccounts has more than 11 restaurant, this will call multiple. TODO: optimize.
                  watchOrder();
                } catch (error) {
                  console.log("Error fetch doc,", error);
                } finally {
                  readyToDisplay.value = true;
                }
              },
            );
          });
        }
        await sleep(0.7);
        if (location.hash && location.hash.split("_")[0] === "#restaurant") {
          scrollToElementById(location.hash.replace("#", ""));
        }
      } catch (error) {
        console.log("Error fetch doc,", error);
      } finally {
        readyToDisplay.value = true;
      }
      if (isOwner.value) {
        onSnapshot(
          query(collectionGroup(db, "lines"), where("uid", "==", uid.value)),
          (result) => {
            result.docs.forEach((res) => {
              const restaurantId = res.data().restaurantId;
              lines.value[restaurantId] = true;
            });
          },
        );
      }

      message_detacher.value = onSnapshot(
        query(
          collection(db, `/admins/${uid.value}/messages`),
          orderBy("createdAt", "desc"),
        ),
        (messageCollection) => {
          messages.value = messageCollection.docs
            .map(doc2data("message"))
            .filter((a: DocumentData) => a.toDisplay);
        },
      );
    });

    const saveRestaurantLists = async () => {
      if (isOwner.value) {
        await setDoc(
          doc(db, `/admins/${uid.value}/public/RestaurantLists`),
          { lists: restaurantLists.value },
          { merge: true },
        );
      }
    };
    const handleNew = async () => {
      console.log("handleNew");
      if (isOwner.value) {
        try {
          const newDoc = doc(collection(db, "restaurants"));
          // update Lists
          restaurantLists.value.push(newDoc.id);
          saveRestaurantLists();

          await setDoc(newDoc, {
            uid: uid.value,
            restaurantId: newDoc.id,
            menuLists: [],
            publicFlag: false,
            numberOfMenus: 0,
            deletedFlag: false,
            createdAt: serverTimestamp(),
          });

          router.push(`/admin/restaurants/${newDoc.id}`);
        } catch (error) {
          store.commit("setErrorMessage", {});
          console.log(error);
        }
      }
    };
    const updateUnsetWarning = (value: boolean) => {
      unsetPaymentWarning.value = value;
    };
    const positionUp = async (itemKey: string) => {
      if (isOwner.value) {
        const pos = restaurantLists.value.indexOf(itemKey);
        if (pos !== 0 && pos !== -1) {
          const newRestaurantLists = [...restaurantLists.value];
          const tmp = newRestaurantLists[pos - 1];
          newRestaurantLists[pos - 1] = newRestaurantLists[pos];
          newRestaurantLists[pos] = tmp;

          restaurantLists.value = newRestaurantLists;
          await saveRestaurantLists();
        }
      }
    };
    const positionDown = async (itemKey: string) => {
      if (isOwner.value) {
        const pos = restaurantLists.value.indexOf(itemKey);
        if (pos < restaurantLists.value.length - 1 && pos !== -1) {
          const newRestaurantLists = [...restaurantLists.value];
          const tmp = newRestaurantLists[pos + 1];
          newRestaurantLists[pos + 1] = newRestaurantLists[pos];
          newRestaurantLists[pos] = tmp;

          restaurantLists.value = newRestaurantLists;

          await saveRestaurantLists();
        }
      }
    };
    const deleteFromRestaurantLists = async (restaurantId: string) => {
      if (isOwner.value) {
        // push list
        const newRestaurantLists = [...restaurantLists.value];
        const pos = newRestaurantLists.indexOf(restaurantId);
        newRestaurantLists.splice(pos, 1);
        restaurantLists.value = newRestaurantLists;

        const path = `/admins/${uid.value}/public/RestaurantLists`;
        await setDoc(
          doc(db, path),
          { lists: newRestaurantLists },
          { merge: true },
        );
        // end of list
      }
    };
    onUnmounted(() => {
      detachOrders();
      if (restaurant_detacher.value) {
        restaurant_detacher.value();
      }
      if (message_detacher.value) {
        message_detacher.value();
      }
    });

    const existsRestaurant = computed(() => {
      if (restaurantItems.value === null) {
        return null;
      }
      if (Object.keys(restaurantItems.value).length > 0) {
        return true;
      }
      return false;
    });

    const existMenu = computed(() => {
      return Object.values(restaurantItems.value || []).find((r) => {
        return (r || {}).numberOfMenus > 1;
      });
    });
    const existPublicRestaurant = computed(() => {
      return Object.values(restaurantItems.value || []).find((r) => {
        return (r || {}).publicFlag;
      });
    });
    const showFiveSteps = computed(() => {
      if (restaurantItems.value === null) {
        return false;
      }
      return (
        unsetPaymentWarning.value ||
        !existsRestaurant.value ||
        !existMenu.value ||
        !existPublicRestaurant.value
      );
    });

    return {
      // ref
      readyToDisplay,
      restaurantItems,
      unsetPaymentWarning,
      lines,
      shopOwner,
      restaurantLists,
      messages,
      numberOfOrderObj,

      // computed
      isOwner,
      existsRestaurant,

      simpleMode,
      switchSimpleMode,

      // methods
      handleNew,
      updateUnsetWarning,
      positionUp,
      positionDown,
      deleteFromRestaurantLists,
      saveRestaurantLists,

      emailVerified,

      existMenu,
      existPublicRestaurant,
      showFiveSteps,
    };
  },
});
</script>
