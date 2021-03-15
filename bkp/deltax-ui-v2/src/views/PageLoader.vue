<template>
  <div>
    <header-bar :section="section" :url="url" />
    <transition name="fade" mode="out-in">
      <div :key="url">
        <dx-load-page :url="url"> </dx-load-page>
      </div>
    </transition>
  </div>
</template>

<script >
import HeaderBar from "@/components/HeaderBar.vue";

export default {
  components: {
    HeaderBar,
  },

  data() {
    return {
      url: "page_loading.html",
      section: "demo",
    };
  },

  watch: {
    $route: {
      immediate: true,
      handler: function (to) {
        this.section = to.params.section;
        this.url = `/${to.params.section}/${to.params.page || "index.html"}`;
      },
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

