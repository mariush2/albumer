<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
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
</style>
