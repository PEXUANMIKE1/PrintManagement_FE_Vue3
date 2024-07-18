<template>
  <v-img class="mx-auto my-6" max-width="100" :src="imgPath"></v-img>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="450" rounded="lg">
    <v-form @submit.prevent="login">
      <div class="text-subtitle-1 text-medium-emphasis">Tài khoản</div>
      <v-text-field
        v-model="userName"
        variant="outlined"
        clearable
        placeholder="Tài khoản"
        prepend-inner-icon="mdi-account-outline"
        :rules="[(v) => !!v || 'Không được bỏ trống ô này']"
      />
      <div class="text-subtitle-1 text-medium-emphasis">Mật khẩu</div>
      <v-text-field
        v-model="password"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :type="showPassword ? 'text' : 'password'"
        clearable
        placeholder="Mật khẩu"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="showPassword = !showPassword"
        :rules="[(v) => !!v || 'Không được bỏ trống ô này']"
      />
      <a class="text-decoration-none text-blue" href="/forgotpassword">
        Quên mật khẩu?
      </a>
      <br />
      <v-btn
        class="mb-8 mt-8"
        size="large"
        color="blue"
        variant="tonal"
        type="submit"
        block
      >
        Đăng nhập
      </v-btn>
      <div class="text-center">
        Bạn chưa có tài khoản?
        <a href="/registerform" class="text-decoration-none text-blue">
          Đăng ký
        </a>
      </div>
      <div class="text-center">
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
          <a href="#" class="mdi mdi-google social-icon" style="color: red"></a>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import router from "@/router";

export default {
  setup() {
    const imgPath = require("@/assets/logo.png");
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
        await store.dispatch("login", userLogin);
        router.push("/");
      } catch (error) {
        console.log("Login failed", error);
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

<style scoped>
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
</style>
