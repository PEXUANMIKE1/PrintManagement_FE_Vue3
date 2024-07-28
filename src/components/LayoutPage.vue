<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="bg-custom">
      <v-list>
        <router-link to="/profilepage" class="text-decoration-none text-white">
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ user ? user.fullName : "Đang tải..." }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                user ? roleName : ""
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>

      <v-divider></v-divider>
      <!-- list chức năng -->
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="bg-custom" dark elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <notification-menu></notification-menu>
      </v-btn>
      <v-btn class="mx-4" @click="logout" variant="outlined"> Logout </v-btn>
    </v-app-bar>

    <v-main>
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import apiService from "@/services/apiService";
import NotificationMenu from "@/components/NotificationMenu.vue";

const store = useStore();
const drawer = ref(true);
const selectedItem = ref(0);
const user = computed(() => store.state.user);

const hasRole = (role) => store.getters.hasRole(role);
const roleName = computed(() => user.value.Permissions);

const logout = async () => {
  await store.dispatch("logout");
  router.push("/loginform");
};

const menuItems = computed(() => {
  let items = [{ title: "Trang chủ", icon: "mdi-home", to: "/" }];

  if (hasRole("Admin")) {
    items.push(
      {
        title: "Quản lý người dùng",
        icon: "mdi-account-box-multiple",
        to: "/users-management",
      },
      {
        title: "Quản lý phòng ban",
        icon: "mdi-account-group",
        to: "/teams-management",
      },
      {
        title: "Quản lý dự án",
        icon: "mdi-briefcase",
        to: "/projects-management",
      },
      {
        title: "Quản lý giao hàng",
        icon: "mdi-truck-delivery-outline",
        to: "/shipping-management",
      },
      { title: "Quản lý tài nguyên", icon: "mdi-cube", to: "/resources" },
      { title: "Báo cáo", icon: "mdi-file-chart", to: "/reports" }
    );
  }
  if (hasRole("Employee") && user.value.teamName == "Sales") {
    items.push(
      {
        title: "Quản lý dự án",
        icon: "mdi-briefcase",
        to: "/projects-management",
      }
      // ,
      // {
      //   title: "Quản lý giao hàng",
      //   icon: "mdi-truck-delivery-outline",
      //   to: "/shipping-management",
      // }
    );
  }
  if (hasRole("Designer")) {
    items.push({
      title: "Quản lý dự án",
      icon: "mdi-briefcase",
      to: "/projects-management",
    });
  }
  if (user.value && user.value.teamName == "Delivery") {
    items.push({
      title: "Quản lý giao hàng",
      icon: "mdi-truck-delivery-outline",
      to: "/shipping-management",
    });
    if (user.value.fullName == Team.value.managerName) {
      items.push({
        title: "Quản lý dự án",
        icon: "mdi-briefcase",
        to: "/projects-management",
      });
    }
  }

  return items;
});

const Team = ref(null);
const GetTeamByTeamName = async (teamName) => {
  try {
    var res = await apiService.GetTeamByTeamName(teamName);
    Team.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  GetTeamByTeamName("Delivery");
});
</script>
