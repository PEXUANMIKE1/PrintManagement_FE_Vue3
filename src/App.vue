<template>
  <v-app>
    <div v-if="!noLayout">
      <LayoutPage/>
    </div>
    <div v-else>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import LayoutPage from "./components/LayoutPage.vue";
export default {
  name: "App",
  components: {
    LayoutPage,
  },
  data() {
    return {
      noLayout: false,
    };
  },
  watch: {
    $route(to) {
      this.noLayout = to.meta.noLayout || false;
    },
  },
};
</script>
