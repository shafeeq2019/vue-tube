import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);
import "./firebase.js";
import App from "./App.vue";
import VueRouter from "vue-router";
import "./store.js";

import store from "./store.js";
Vue.use(VueRouter);
Vue.config.productionTip = false;
import router from "./router.js";
import './registerServiceWorker'


new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");

//window.addEventListener('contextmenu',function(e){
//  e.preventDefault();
//})
