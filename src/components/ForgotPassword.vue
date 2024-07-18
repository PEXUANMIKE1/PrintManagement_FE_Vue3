<template>
  <div class="forgot-password-container">
    <v-card class="mx-auto pa-12 pb-8 forgot-password-card" elevation="8" max-width="450" rounded="lg">
      <v-form ref="form" @submit.prevent="forgotPass" v-model="isFormValid">
        <div class="mb-6 text-center">
          <h2>Hãy nhập địa chỉ email của bạn</h2>
        </div>
        <v-text-field
          v-model="email"
          variant="outlined"
          clearable
          placeholder="abc@gmail.com"
          prepend-inner-icon="mdi-email-outline"
          :rules="[(v) => !!v || 'Không được bỏ trống ô này']"
          required
          @input="validateForm"
        />
        <v-btn
          class="mb-8 mt-8"
          size="large"
          color="yellow"
          type="submit"
          block
        >
          Gửi mã
        </v-btn>
        <div class="text-center">
          <a href="/loginform" class="text-decoration-none text-blue">
            <span class="mdi mdi-menu-left"></span> Trở lại
          </a>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import apiService from "@/services/apiService";
import router from "@/router";

export default {
  setup() {
    const imgPath = require("@/assets/logo.png");
    const email = ref("");
    const form = ref(null);
    const isFormValid = ref(false);

    const validateForm = () => {
      if (form.value) {
        form.value.validate();
      }
    };

    watch(email, validateForm);

    const forgotPass = async () => {
      if (!form.value) return;

      const { valid } = await form.value.validate();

      if (valid) {
        try {
          const res = await apiService.ForgotPassword(email.value);
          alert(res);
          if (res === "Đã gửi mã xác nhận quên mật khẩu! Vui lòng kiểm tra hòm thư của bạn") {
            router.push("/createnewpassword");
          }
        } catch (error) {
          console.error("Send code failed!", error);
          let errorMessage = "có lỗi xảy ra. Vui lòng thử lại.";
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          alert(errorMessage);
        }
      } else {
        console.log("Form is not valid");
      }
    };

    return {
      imgPath,
      email,
      form,
      forgotPass,
      isFormValid,
      validateForm,
    };
  },
};
//
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;
}

.forgot-password-card {
  backdrop-filter: blur(10px);
  background-color: white;
}

.text-blue {
  color: #1976D2;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
