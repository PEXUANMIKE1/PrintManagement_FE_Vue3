<template>
  <div class="login-container">
    <v-card
      class="mx-auto mb-12 pa-16 login-card"
      elevation="8"
      max-width="700"
      rounded="lg"
    >
      <v-form ref="form" v-model="isValid" @submit.prevent="register">
        <div class="form-title">Đăng ký</div>
        <div class="text-subtitle-1 text-medium-emphasis">Tài khoản</div>
        <v-text-field
          v-model="userName"
          clearable
          variant="outlined"
          placeholder="Tài khoản"
          prepend-inner-icon="mdi-account-outline"
          :rules="rulesBase"
        >
        </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Mật khẩu</div>
        <v-text-field
          v-model="password"
          :append-inner-icon="x ? 'mdi-eye-off' : 'mdi-eye'"
          :type="x ? 'text' : 'password'"
          placeholder="Mật khẩu"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          clearable
          @click:append-inner="x = !x"
          :rules="rulesBase"
        >
        </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Ngày sinh</div>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="date"
              placeholder="Ngày sinh"
              prepend-inner-icon="mdi-calendar-outline"
              readonly
              clearable
              v-bind="props"
              variant="outlined"
              :rules="rulesBase"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @update:model-value="menu = false"
          ></v-date-picker>
        </v-menu>
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
        <v-text-field
          v-model="email"
          variant="outlined"
          type="email"
          clearable
          placeholder="abc@gmail.com"
          prepend-inner-icon="mdi-email-outline"
          :rules="emailRules"
        >
        </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Họ và tên</div>
        <v-text-field
          v-model="fullName"
          variant="outlined"
          placeholder="Nguyen Van A"
          clearable
          prepend-inner-icon="mdi-card-account-details"
          :rules="rulesBase"
        >
        </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Số điện thoại</div>
        <v-text-field
          v-model="phoneNumber"
          variant="outlined"
          type="tel"
          placeholder="+84"
          clearable
          prepend-inner-icon="mdi-phone"
          :rules="rulesBase"
        >
        </v-text-field>
        <v-checkbox
          v-model="agree"
          required
          :rules="rulesBase"
        >
          <template v-slot:label>
            Tôi đồng ý với&nbsp;
            <a href="#" class="text-decoration-none text-blue" target="_blank">
              chính sách và điều khoản của InkMastery
            </a>
          </template>
        </v-checkbox>
        <v-btn
          type="submit"
          class="mb-6 register-button"
          color="yellow"
          size="large"
          block
          >Đăng Ký</v-btn
        >
        <div class="mb-12 sign-in text-center">
          Bạn đã có tài khoản?
          <a href="/loginform">
            Đăng nhập
          </a>
        </div>
        <div class="text-center">
          <div class="divider">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>
          <div class="mt-1 text-subtitle-1 text-medium-emphasis social-icons">
            <a
              href="#"
              class="mdi mdi-facebook social-icon"
              style="color: blue"
            ></a>
            <a href="#" class="mdi mdi-github social-icon"></a>
            <a
              href="#"
              class="mdi mdi-google social-icon"
              style="color: red"
            ></a>
          </div>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref } from "vue";
import apiService from "@/services/apiService";
import router from "@/router";

export default {
  setup() {
    const x = ref(false);
    const date = ref(null);
    const menu = ref(false);
    const agree = ref(false);
    const password = ref("");
    const userName = ref("");
    const email = ref("");
    const fullName = ref("");
    const phoneNumber = ref("");
    const form = ref(null);
    const isValid = ref(false);
    const rulesBase = [v => !!v || 'Không được bỏ trống ô này'];
    const emailRules = [v => !!v || 'Không được bỏ trống ô này',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Định dạng email không chính xác'];


    const register = async () => {
      if (form.value.validate()) {
        try {
          const registerForm = {
            userName: userName.value,
            password: password.value,
            fullName: fullName.value,
            dateOfBirth: date.value.toISOString(),
            email: email.value,
            phoneNumber: phoneNumber.value,
          };
          // console.log("Register form: ", registerForm);
          var res = await apiService.Register(registerForm);
          if(res.status == 201){
            alert(res.message);
          }
          console.log(res);
          router.push("/confirm-code-register");
        } catch (error) {
          console.log("Register fail", error);
        }
      }
    };
    return {
      x,
      date,
      menu,
      agree,
      password,
      userName,
      email,
      fullName,
      phoneNumber,
      register,
      form,
      isValid,
      emailRules,
      rulesBase,
    };
  },
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.login-card {
  padding: 24px;
  max-width: 700px;
  width: 100%;
  border-radius: 16px;
  background-color: white;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px; /* Khoảng cách giữa các biểu tượng */
}

.social-icon {
  font-size: 36px; /* Kích thước của biểu tượng */
  color: #333; /* Màu của biểu tượng */
  text-decoration: none;
  transition: color 0.3s ease;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider hr {
  flex: 1;
  border: none;
  border-top: 1px solid #ccc;
}

.divider span {
  padding: 0 10px;
  font-size: 18px;
}
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}
.register-button {
  font-weight: bold;
}
.sign-in a {
  color: #006eff;
  font-weight: bold;
}
</style>
