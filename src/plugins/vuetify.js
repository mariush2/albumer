import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#F19171',
        secondary: '#F193AF',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
  icons: {
    iconfont: 'fa',
  },
});
