import { ref } from 'vue';

const showAlert = ref(false);
const typeAlert = ref('success');
const message = ref('');

const useAlert = () => {
  const ToggleShowAlert = (msg, type) => {
    message.value = msg;
    typeAlert.value = type;
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
  };

  return {
    showAlert,
    typeAlert,
    message,
    ToggleShowAlert
  };
};

export default useAlert;
