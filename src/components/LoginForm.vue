<template>
  <div class="login-container">
    <v-card class="login-card" elevation="8">
      <v-form @submit.prevent="login">
        <div class="form-title">Đăng nhập</div>
        <v-text-field
          v-model="userName"
          placeholder="Tài khoản"
          variant="outlined"
          clearable
          prepend-inner-icon="mdi-account-outline"
          :rules="[(v) => !!v || 'This field is required']"
        />
        <v-text-field
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          clearable
          placeholder="Mật khẩu"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="showPassword = !showPassword"
          :rules="[(v) => !!v || 'This field is required']"
        />
        <div class="forgot-password">
          <a href="/forgotpassword">Quên mật khẩu?</a>
        </div>
        <v-btn
          class="login-button"
          color="yellow"
          type="submit"
          block
        >
          Đăng nhập
        </v-btn>
        <div class="mt-5 sign-up">
          Bạn chưa có tài khoản? <a href="/registerform">Đăng ký</a>
        </div>
        <div class="mt-3 text-center">
          <div class="divider">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>
          <div class="text-subtitle-1 text-medium-emphasis social-icons">
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
import { useStore } from "vuex";
import { ref } from "vue";
import router from "@/router";
import "@/assets/css/login.css"

export default {
  setup() {
    const imgPath = require('@/assets/logo.png'); // Update this path to the uploaded image
    const showPassword = ref(false);
    const store = useStore();
    const userName = ref("");
    const password = ref("");

    const login = async () => {
      try {
        const userLogin = {
          userName: userName.value,
          password: password.value,
        };
        var res = await store.dispatch("login", userLogin);
        //console.log(res);
        if(res.status === 200){
          router.push("/");
        }else if(res.status === 401){
          alert(res.message + " Vui lòng xác nhận tài khoản email!");
          router.push("/confirm-code-register");
        }else{
          alert(res.message);
        }
      } catch (error) {
        console.error("Login failed", error);
        alert("Có lỗi trong quá trình đăng nhập");
      }
    };
    return {
      imgPath,
      showPassword,
      userName,
      password,
      login,
    };
  },
};
</script>


