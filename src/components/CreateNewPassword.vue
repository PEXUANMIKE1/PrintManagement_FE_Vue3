<template>
  <div class="forgot-password-container">
    <v-card class="mx-auto pa-12 pb-8 forgot-password-card" elevation="8" max-width="500" rounded="lg">
      <v-form ref="form" @submit.prevent="CreateNewPassForgot" v-model="isFormValid">
        <div class="mb-6 text-center">
          <h2>Hãy nhập mã xác nhận và mật khẩu mới</h2>
        </div>
        <div class="text-subtitle-1 text-medium-emphasis">Confirm Code</div>
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
        <div class="text-subtitle-1 text-medium-emphasis">New Password</div>
        <v-text-field
          v-model="newPassword"
          :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showNewPassword ? 'text' : 'password'"
          variant="outlined"
          clearable
          placeholder="Mật khẩu mới"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="showNewPassword = !showNewPassword"
          :rules="passwordRules"
          required
          @input="validateForm"
        />
        <div class="text-subtitle-1 text-medium-emphasis">Confirm Password</div>
        <v-text-field
          v-model="confirmPassword"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showConfirmPassword ? 'text' : 'password'"
          variant="outlined"
          clearable
          placeholder="Xác nhận mật khẩu"
          prepend-inner-icon="mdi-lock-check-outline"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :rules="confirmPasswordRules"
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
          <a href="/forgotpassword" class="text-decoration-none text-blue">
            <span class="mdi mdi-menu-left"></span> Trở lại
          </a>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import apiService from "@/services/apiService";
import router from "@/router";

export default {
  setup() {
    const showConfirmPassword = ref(false);
    const showNewPassword = ref(false);
    const code = ref("");
    const confirmPassword = ref("");
    const newPassword = ref("");
    const form = ref(null);
    const isFormValid = ref(false);

    const passwordRules = [
      v => !!v || 'Mật khẩu không được để trống',
      // v => v.length >= 8 || 'Mật khẩu phải có ít nhất 8 ký tự',
      // v => /[A-Z]/.test(v) || 'Mật khẩu phải chứa ít nhất một chữ hoa',
      // v => /[a-z]/.test(v) || 'Mật khẩu phải chứa ít nhất một chữ thường',
      // v => /[0-9]/.test(v) || 'Mật khẩu phải chứa ít nhất một số',
    ];

    const confirmPasswordRules = computed(() => [
      v => !!v || 'Xác nhận mật khẩu không được để trống',
      v => v === newPassword.value || 'Mật khẩu xác nhận không khớp',
    ]);

    const validateForm = () => {
      if (form.value) {
        form.value.validate();
      }
    };

    const CreateNewPassForgot = async () => {
      try {
        const data = {
          confirmCode: code.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        };
        const response = await apiService.ConfirmCreateNewPass(data);
        alert(response);
        if (response === "Thay đổi mật khẩu thành công!") {
          router.push("/");
        }
        if (response === "Mã xác nhận đã hết hạn! Vui lòng gửi lại") {
          router.push("/forgotpassword");
        }
      } catch (error) {
        console.error("Send code failed!", error);
      }
    };

    return {
      code,
      confirmPassword,
      newPassword,
      showNewPassword,
      showConfirmPassword,
      isFormValid,
      validateForm,
      CreateNewPassForgot,
      passwordRules,
      confirmPasswordRules,
    };
  }
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2); /* Adjust to match your login page's background color */
}

.forgot-password-card {
  background-color: #ffffff; /* White background for the card */
}

.text-blue {
  color: #1976D2;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
