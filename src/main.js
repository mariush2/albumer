import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

Vue.config.productionTip = false;

store.dispatch('refreshAccessToken');

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
