import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';

Vue.config.productionTip = false;

store.dispatch('refreshAccessToken');
store.dispatch('getUserFromCookie');

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
