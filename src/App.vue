<template>
  <v-app>
    <div v-if="!noLayout">
      <LayoutPage />
    </div>
    <div v-else>
      <router-view />
    </div>
    <v-main>
      <v-alert
        class="alert-card"
        closable
        :text="message"
        v-if="showAlert"
        title="Thông báo"
        :type="typeAlert"
      ></v-alert
    ></v-main>
  </v-app>
</template>

<script>
import LayoutPage from "./components/LayoutPage.vue";
import useAlert from "@/plugins/Alert";

export default {
  name: "App",
  components: {
    LayoutPage,
  },
  setup(){
    const { message, showAlert, typeAlert } = useAlert();
    return {
      message,
      showAlert,
      typeAlert,
    };
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
