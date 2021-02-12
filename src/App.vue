<template>
  <div id="app">
    <div v-if="showNav" id="nav">
      <el-button
        circle
        icon="el-icon-house"
        size="medium"
        :type="isActive('/') ? 'primary' : 'default'"
        :underline="false"
        @click="handleClick('/')"
      />
      <el-button
        circle
        icon="el-icon-menu"
        size="medium"
        :type="isActive('/list') ? 'primary' : 'default'"
        :underline="false"
        @click="handleClick('/list')"
      />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    showNav: function() {
      return this.$router.history.current.path != '/login';
    },
  },
  methods: {
    handleClick(newRoute) {
      if (!this.isActive(newRoute)) this.$router.push(newRoute);
    },
    isActive(route) {
      return this.$router.history.current.path == route;
    },
  },
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
  font-family: 'Comfortaa', sans-serif !important;
  background: #b65b6b;
}

#nav {
  display: grid;
  justify-content: flex-end;
  grid-auto-columns: min-content;
  font-size: 32px;
  margin-top: 1rem;
  margin-right: 1rem;
  * {
    grid-row: 1;
  }
}
</style>
