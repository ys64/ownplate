<template>
  <section class="mx-auto max-w-full px-6 pt-4 pb-12">
    <back-button url="/s" />
    <h2>Callback</h2>
    <div v-if="log">
      {{ moment(log.created.toDate()).format("YYYY-MM-DD hh:mm") }}/{{
        log.uid || log.data.uid
      }}/{{ stripeActionStrings[log.action] }}
      <pre>{{ log.data }}</pre>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BackButton from "@/components/BackButton.vue";
import { stripeActionStrings } from "@/lib/stripe/stripe";
import { db } from "@/lib/firebase/firebase9";
import { doc, getDoc } from "firebase/firestore";

import { useSuper, defaultTitle } from "@/utils/utils";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import moment from "moment";

export default defineComponent({
  components: {
    BackButton,
  },
  setup() {
    useSuper();
    const route = useRoute();

    const log = ref<any>(null);

    useHead(() => ({
      title: [defaultTitle, "Super All Stripe Callback"].join(" / "),
    }));

    const logUid = route.params.uid;
    const logId = route.params.logId;
    getDoc(doc(db, `admins/${logUid}/stripeLogs/${logId}`)).then((_doc) => {
      log.value = _doc.data();
    });
    return {
      stripeActionStrings,
      log,
      moment,
    };
  },
});
</script>
