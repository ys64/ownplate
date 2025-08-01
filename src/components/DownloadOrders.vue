<template>
  <download-csv
    :data="tableData"
    :fields="fields"
    :fieldNames="fieldNames"
    :fileName="fileName"
  >
    <button class="cursor-pointer">
      <div
        class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
      >
        <i class="material-icons text-op-teal mr-2 text-lg">save_alt</i>
        <div class="text-op-teal text-sm font-bold">
          {{ $t("admin.report.download-csv-history") }}
        </div>
      </div>
    </button>
  </download-csv>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import DownloadCsv from "@/components/DownloadCSV.vue";
import moment from "moment";
import { nameOfOrder } from "@/utils/strings";
import { parsePhoneNumber, formatNational } from "@/utils/phoneutil";
import { order_status } from "@/config/constant";
import { arrayOrNumSum, orderTypeKey, getRestaurantId } from "@/utils/utils";

import { useI18n } from "vue-i18n";
import { downloadFields } from "@/utils/reportUtils";

export default defineComponent({
  components: {
    DownloadCsv,
  },
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: "global" });
    const fields = downloadFields;
    const fieldNames = fields.map((field) => {
      return t(`order.${field}`);
    });

    const tableData = computed(() => {
      return props.orders.map((order: any) => {
        const totalCount = Object.keys(order.order).reduce((count, id) => {
          return count + arrayOrNumSum(order.order[id]);
        }, 0);
        const status = Object.keys(order_status).reduce((result, key) => {
          if (order_status[key] === order.status) {
            return key;
          }
          return result;
        }, "unexpected");
        return {
          datePlaced: moment(order.timePlaced).format("YYYY/MM/DD HH:mm"),
          type: t("order." + orderTypeKey(order)),
          dateEstimated:
            order.timeEstimated &&
            moment(order.timeEstimated).format("YYYY/MM/DD HH:mm"),
          dateConfirmed:
            order.timeConfirmed &&
            moment(order.timeConfirmed).format("YYYY/MM/DD HH:mm"),
          statusName: t(`order.status.${status}`),
          totalCount: totalCount,
          total: order.totalCharge,
          discountPrice: order.discountPrice || 0,
          beforeDiscountPrice: order.totalCharge + (order.discountPrice || 0),
          phoneNumber: order.phoneNumber
            ? formatNational(parsePhoneNumber(order.phoneNumber))
            : "LINE",
          name: nameOfOrder(order),
          payment: order.payment?.stripe ? "stripe" : "",
        };
      });
    });
    const restaurantId = getRestaurantId();
    const fileName = restaurantId + "_orderhistory_summary";
    return {
      fileName,
      fields,
      fieldNames,
      tableData,
    };
  },
});
</script>
