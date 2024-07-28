<template>
  <v-card class="elevation-12 rounded profile-card">
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

    <v-row v-if="user && !loading">
      <v-col cols="12" md="3">
        <v-img cover :src="avatarUrl" class="rounded-circle img"></v-img>
        <v-list>
          <v-list-item link @click="showChangePassword = false">
            <v-list-item-content>
              <v-list-item-title>Thông tin tài khoản</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>Bảo vệ tài khoản</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>Nhật ký hoạt động</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>Kết nối</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>Giấy phép</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="showChangePassword = true">
            <v-list-item-content>
              <v-list-item-title>Đổi mật khẩu</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="9">
        <v-card class="elevation-2 rounded info-card" v-if="!showChangePassword">
          <v-card-title class="text-center">Thông tin tài khoản</v-card-title>
          <v-card-text>
            <v-row>
              <!-- User Information Fields -->
              <v-col cols="12">
                <v-label>Số điện thoại</v-label>
                <v-text-field
                  v-model="user.phoneNumber"
                  variant="outlined"
                  hide-details
                  single-line
                  readonly
                  density="compact"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label>Email</v-label>
                <v-text-field
                  v-model="user.email"
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label>Họ và Tên</v-label>
                <v-text-field
                  v-model="user.fullName"
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label>Giới tính</v-label>
                <v-text-field
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  readonly
                  class="mb-2"
                  >Nam</v-text-field
                >
              </v-col>
              <v-col cols="12">
                <v-label>Đội nhóm</v-label>
                <v-text-field
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  class="mb-2"
                  >{{ user.teamName }}</v-text-field
                >
              </v-col>
              <v-col cols="12">
                <v-label>Ngày sinh</v-label>
                <v-text-field
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  readonly
                  class="mb-2"
                  >{{ formatDate(user.dateOfBirth) }}</v-text-field
                >
              </v-col>
              <v-col cols="12">
                <v-label>Tình trạng hôn nhân</v-label>
                <v-text-field
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  readonly
                  class="mb-2"
                  >Độc thân</v-text-field
                >
              </v-col>
              <v-col cols="12">
                <v-label>Địa chỉ</v-label>
                <v-text-field
                  variant="outlined"
                  hide-details
                  single-line
                  density="compact"
                  readonly
                  class="mb-2"
                  >Cầu diễn, Bắc Từ Liêm, Hà Nội</v-text-field
                >
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" class="text-center">
                <v-btn color="primary" @click="changeinfo">Lưu</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="elevation-2 rounded change-pas-card" v-if="showChangePassword">
          <v-form @submit.prevent="changePassword">
            <v-card-title class="text-center">Đổi mật khẩu</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-label>Mật khẩu cũ</v-label>
                  <v-text-field
                    v-model="currentPassword"
                    :append-inner-icon="
                      showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    :type="showCurrentPassword ? 'text' : 'password'"
                    clearable
                    variant="outlined"
                    hide-details
                    single-line
                    density="compact"
                    class="mb-2"
                    @click:append-inner="showCurrentPassword = !showCurrentPassword"
                    :rules="[(v) => !!v || 'This field is required']"
                  />
                </v-col>
                <v-col cols="12">
                  <v-label>Mật khẩu mới</v-label>
                  <v-text-field
                    v-model="newPassword"
                    :append-inner-icon="
                      showNewPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    :type="showNewPassword ? 'text' : 'password'"
                    clearable
                    variant="outlined"
                    hide-details
                    single-line
                    density="compact"
                    class="mb-2"
                    @click:append-inner="showNewPassword = !showNewPassword"
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-label>Xác nhận mật khẩu mới</v-label>
                  <v-text-field
                    v-model="confirmPassword"
                    :append-inner-icon="
                      showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    :type="showConfirmPassword ? 'text' : 'password'"
                    clearable
                    variant="outlined"
                    hide-details
                    single-line
                    density="compact"
                    class="mb-2"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-4">
                <v-col cols="12" class="text-center">
                  <v-btn color="primary" type="submit">Đổi mật khẩu</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import apiService from "@/services/apiService";
import { ref, onMounted, computed } from "vue";

    const loading = ref(true);
    const user = ref(null);
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showChangePassword = ref(false);
    //const baseUrl = process.env.VUE_APP_BASE_API_URL;
    const baseUrl = 'https://localhost:7262/';
    const getUserDetails = async () => {
      try {
        const res = await apiService.GetInforMyself();
        user.value = res.data;
        //console.log(user.value);
        //console.log(process.env.VUE_APP_BASE_API_URL);
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const avatarUrl = computed(()=>{
      if(user.value && user.value.avatar){
        return `${baseUrl}Upload/Files/${user.value.avatar}`;
      }
      return 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-1024.png';
    });


    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const changePassword = async () => {
      try {
        const data = {
          oldPassword: currentPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        };
        const res = await apiService.ChangePassword(data);
        alert(res.message);
        if(res.status === 200){
          showChangePassword.value = false;
        }
        
      } catch (error) {
        console.error("Đổi mật khẩu thất bại", error);
      }
    };

    const changeinfo = async () => {
      try {
        const res = await apiService.changeinfo(
          user.value.id,
          user.value.fullName,
          user.value.email,
          user.value.phoneNumber
        );
        console.log(res);
      } catch (error) {
        console.error("Đổi thông tin thất bại", error);
      }
    };

    onMounted(() => {
      getUserDetails();
    });

</script>

<style scoped>
.img {
  box-shadow: 2px 2px 4px 3px #cbc9c9;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  width: 300px;
  margin: 30px;
}

.profile-card {
  height: 97%;
  margin: 20px;
}

.text-center {
  text-align: center;
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}
.change-pas-card {
  height: 150%;
}
.info-card {
  height: 150%;
}
</style>
