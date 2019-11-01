import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false; // Setup accessToken to Spotify

const accessToken =
  'BQDX7fd_2xlmbe5Sb0pEA4y1X-0kEgOZQXMvvRDUPi3oZs7Aw88v9bEheT1JHobteilEULOmxmAbVhSQdV0';

store.commit('changeAccessToken', accessToken);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
