<template>
  <div>
    <template v-if="news === undefined">
      <not-found />
    </template>
    <template v-else>
      <!-- Header -->
      <div class="mx-6 mt-4 flex items-center space-x-4">
        <router-link :to="'/admin/restaurants'">
          <div
            class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
          >
            <i class="material-icons text-op-teal mr-2 text-lg">home</i>
            <div class="text-op-teal text-sm font-bold">
              {{ $t("button.adminTop") }}
            </div>
          </div>
        </router-link>

        <router-link :to="'/admin/news'">
          <div
            class="inline-flex h-9 items-center justify-center rounded-full bg-black/5 px-4"
          >
            <i class="material-icons text-op-teal mr-2 text-lg">list</i>
            <div class="text-op-teal text-sm font-bold">
              {{ $t("admin.news.newsTop") }}
            </div>
          </div>
        </router-link>
      </div>

      <!-- Body -->
      <div class="mx-auto mt-4 max-w-(--breakpoint-md) px-6 text-base">
        <div class="text-xl font-bold text-black/30">
          {{ news.title }}
        </div>

        <div class="mt-2 text-base font-bold text-black/30">
          {{ news.date.replace(/\-/g, ".") }}
        </div>

        <div
          class="article-list mt-2 text-base font-bold text-black/30"
          v-html="md.render(news.markdown)"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MarkdownIt from "markdown-it";
import newsList from "@/app/admin/News/data";
import NotFound from "@/components/NotFound.vue";
import { useRoute } from "vue-router";
import { defaultTitle } from "@/utils/utils";
import { useHead } from "@unhead/vue";

export default defineComponent({
  components: {
    NotFound,
  },
  setup() {
    const route = useRoute();
    const newsId = route.params.newsId;
    const news = newsList.find((element) => element.date === newsId);

    useHead(() => ({
      title: [(news || {}).title, defaultTitle].join(" / "),
    }));

    return {
      md: new MarkdownIt(),
      news,
    };
  },
});
</script>

<style lang="css" scoped>
::v-deep(.article-list) ul {
  list-style: none;
  margin-top: 8px;
  margin-bottom: 12px;
}

::v-deep(.article-list) > ul > li ul li {
  list-style: outside;
  margin-left: 36px;
  margin-bottom: 4px;
  font-weight: normal;
  color: #333333;
}
::v-deep(a) {
  @apply underline;
}
</style>
