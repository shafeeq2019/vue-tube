import { createApp } from "vue";
import { createPinia } from "pinia";
import { createBootstrap } from "bootstrap-vue-next";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "./styles.css";
import "./theme.js";
import App from "./App.vue";
import router from "./router.js";

createApp(App)
  .use(createPinia())
  .use(createBootstrap())
  .use(router)
  .mount("#app");
