<template>
  <v-card class="elevation-12 rounded">
    <router-link to="/">
      <button class="btn-close">
        <v-icon>mdi-close</v-icon>
      </button>
    </router-link>
    <v-card-title>Thông tin người dùng</v-card-title>
    <v-spacer></v-spacer>
    <v-card-text v-if="loading">
      <v-row class="d-flex justify-center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="user && !loading">
      <v-row class="d-flex justify-center">
        <v-col md="2" class="d-flex justify-center">
          <v-img
            width="100%"
            aspect-ratio="1"
            cover
            :src="user.avatar"
            class="rounded-circle img"
          ></v-img
        ></v-col>
      </v-row>
      <!-- user name, email, name -->
      <v-row>
        <v-col cols="12" md="6">
          <v-lable>Email</v-lable>
          <v-text-field
            variant="outlined"
            hide-details
            single-line
            readonly
            density="compact"
            class="mb-2"
            >{{ user.email }}</v-text-field
          >
        </v-col>
        <v-col cols="12" md="6">
          <v-lable>Họ và tên</v-lable>
          <v-text-field
            variant="outlined"
            hide-details
            single-line
            readonly
            density="compact"
            class="mb-2"
            >{{ user.fullName }}</v-text-field
          >
        </v-col>
      </v-row>
      <!-- Address, website -->
      <v-row>
        <v-col cols="12" md="12">
          <v-lable>Address</v-lable>
          <v-text-field
            variant="outlined"
            hide-details
            single-line
            readonly
            density="compact"
            class="mb-2"
            >{{ user.address }}</v-text-field
          >
        </v-col>
      </v-row>
      <!-- Phone, company -->
      <v-row>
        <v-col cols="12" md="6">
          <v-lable>Phone</v-lable>
          <v-text-field
            variant="outlined"
            hide-details
            single-line
            readonly
            density="compact"
            class="mb-2"
            >{{ user.phoneNumber }}</v-text-field
          >
        </v-col>
        <v-col cols="12" md="6">
          <v-lable>Date Of Birth</v-lable>
          <v-text-field
            variant="outlined"
            hide-details
            single-line
            readonly
            density="compact"
            class="mb-2"
            >{{ user.dateOfBirth }}</v-text-field
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import axiosInstance from "@/plugins/axios";

export default {
  data() {
    return {
      id: 1,
      user: {
        id: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        avatar: "",
      },
      loading: true,
    };
  },
  created() {
    this.getUserDetails(this.id);  
  },
  methods: {
    async getUserDetails(id) {
      try {
        const res = await axiosInstance.get(`api/Auth/GetUserById/user?id=${id}`);
        this.user = res.data.data;
        this.user.dateOfBirth = this.formatDateTime(this.user.dateOfBirth);
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    formatDateTime(date) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const newDate = new Date(date);
      return newDate.toLocaleDateString("vi-VN", options).replace(/\//g, "-");
    },
  },
};

</script>
<style scoped>
.img {
  box-shadow: 2px 2px 4px 3px #cbc9c9;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}

.img:hover {
  scale: 1.1;
  box-shadow: 2px 2px 4px 3px #6f6e6e;
}
.btn-close{
  color: black;
}
</style>
