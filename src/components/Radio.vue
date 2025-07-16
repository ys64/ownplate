<template>
  <label
    class="flex items-center"
    :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
  >
    <input
      type="radio"
      :name="name"
      :value="nativeValue"
      :checked="modelValue === nativeValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', nativeValue)"
      class="peer sr-only"
    />
    <span
      class="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 transition-colors duration-200 ease-in-out peer-checked:border-blue-500 peer-checked:bg-blue-500 dark:border-gray-600"
      :class="{
        'opacity-50': disabled,
      }"
    >
      <span
        class="h-2 w-2 rounded-full bg-white transition-opacity duration-200 ease-in-out"
        :class="{ 'opacity-0': modelValue !== nativeValue }"
      ></span>
    </span>
    <span
      class="ml-3 text-sm text-gray-700 dark:text-white"
      :class="{
        'opacity-50': disabled,
      }"
    >
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string | number;
  nativeValue: string | number;
  name?: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const name = computed(
  () =>
    props.name || `radio-group-${Math.random().toString(36).substring(2, 9)}`,
);
</script>
