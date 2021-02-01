<template>
  <v-app>
    <template v-if="isAuthenticated">
      <router-view></router-view>
    </template>
    <template v-else>
      <Login />
    </template>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import Login from './views/Login.vue';

export default {
  name: 'App',
  components: {
    Login,
  },
  computed: mapState({
    isAuthenticated: state => state.isAuthenticated,
  }),
};
</script>

<style lang="scss">
@font-face {
  font-family: 'Comfortaa';
  src: url('~@/assets/fonts/Comfortaa-Regular.ttf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'Comfortaa';
  src: url('~@/assets/fonts/Comfortaa-Light.ttf') format('truetype');
  font-weight: 200;
}

@font-face {
  font-family: 'Comfortaa';
  src: url('~@/assets/fonts/Comfortaa-Bold.ttf') format('truetype');
  font-weight: 500;
}

#app,
body {
  font-family: 'Comfortaa', sans-serif;
  background: #b65b6b;
}
</style>
