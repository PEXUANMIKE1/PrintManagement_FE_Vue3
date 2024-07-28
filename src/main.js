import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import axiosPlugin from './plugins/axios'
import './assets/css/main.css'

const app = createApp(App)

loadFonts()
store.dispatch('initializeStore').then(() => {
  app.use({
    install(app) {
      app.config.globalProperties.$axios = axiosPlugin
    }
  })

  app.config.errorHandler = (err, vm, info) => {
    console.error(`[Global Error Handler] Error: ${err.toString()}\nInfo: ${info}`);
  };
  app.use(router).use(vuetify).use(store).mount('#app')
});