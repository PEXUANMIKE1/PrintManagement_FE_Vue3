<template>
  <div class="confirm-code-container">
    <v-card class="mx-auto pa-12 pb-8 confirm-code-card" elevation="8" max-width="450" rounded="lg">
      <v-form ref="form" @submit.prevent="confirmCode" v-model="isFormValid">
        <div class="mb-6 text-center">
          <h2>Nhập mã xác nhận của bạn</h2>
        </div>
        <v-text-field
          v-model="code"
          variant="outlined"
          clearable
          placeholder="Code"
          prepend-inner-icon="mdi-text-recognition"
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
          Xác nhận
        </v-btn>
        <div class="text-center">
          <router-link to="/loginform" class="text-decoration-none text-blue">
            <span class="mdi mdi-menu-left"></span> Trở lại
          </router-link>
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
    const code = ref("");
    const form = ref(null);
    const isFormValid = ref(false);

    const validateForm = () => {
      if (form.value) {
        form.value.validate();
      }
    };

    watch(code, validateForm);

    const confirmCode = async () => {
      if (!form.value) return;

      const { valid } = await form.value.validate();

      if (valid) {
        try {
          var res = await apiService.ConfirmEmail(code.value);
          alert(res);
          if(res === "Xác nhận đăng ký tài khoản thành công. Bạn có thể đăng nhập vào hệ thống!"){
            router.push("/");
          }
        } catch (error) {
          console.error("Confirmation failed!", error);
          let errorMessage = "Xác nhận không thành công. Vui lòng thử lại.";
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
      code,
      form,
      confirmCode,
      isFormValid,
      validateForm,
    };
  },
};
</script>

<style scoped>
.confirm-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;
}

.confirm-code-card {
  backdrop-filter: blur(10px);
  background-color: white; /* Đổi opacity để làm cho card nhìn mờ hơn */
}

.text-blue {
  color: #1976D2;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
