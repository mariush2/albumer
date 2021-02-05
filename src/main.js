import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import './theme.scss';
import router from './router';
import store from './store';
import './registerServiceWorker';
import { auth } from './firebase';

Vue.config.productionTip = false;

store.dispatch('refreshAccessToken');

Vue.use(ElementUI, { locale });

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    store.dispatch('refreshAlbumsInList');
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
