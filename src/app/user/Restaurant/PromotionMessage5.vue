<template>
  <div>
    <template v-if="promotion.discountMethod === 'amount'">
      最大{{ $n(promotion.discountValue, "currency") }}値引き
    </template>
    <template v-if="promotion.discountMethod === 'ratio'">
      最大{{ promotion.discountValue }}% 値引き
    </template>
    <span class="-ml-1 text-sm"> キャンペーン実施中！ </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    promotion: {
      type: Object,
      required: true,
    },
  },
});
</script>
