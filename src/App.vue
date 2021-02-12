<template>
  <div id="app">
    <template v-if="$router.history.current.path != '/login'">
      <div id="bar">
        <el-button circle icon="el-icon-menu" size="medium" type="default" @click="drawer = true" />
      </div>
      <el-drawer title="Pages" :visible.sync="drawer" size="min-content" direction="ltr">
        <el-menu
          background-color="#b65b6b"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="defaultActive"
        >
          <el-menu-item index="1" @click="handleClick('/')">
            <i class="el-icon-house"></i>
            <span>Home</span>
          </el-menu-item>
          <el-menu-item index="2" @click="handleClick('/list')">
            <i class="el-icon-document"></i>
            <span>Current list</span>
          </el-menu-item>
        </el-menu>
        <li id="logout" @click="logOut">
          <i class="el-icon-unlock"></i>
          <span>Log out</span>
        </li>
      </el-drawer>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { auth } from './firebase';

export default {
  name: 'App',
  data: function() {
    return {
      drawer: false,
    };
  },
  computed: {
    defaultActive: function() {
      let active;
      switch (this.$router.history.current.path) {
        case '/':
          active = '1';
          break;
        case '/list':
          active = '2';
          break;
      }
      return active;
    },
  },
  methods: {
    handleClick(newRoute) {
      if (!this.isActive(newRoute)) {
        this.$router.push(newRoute);
        this.drawer = false;
      }
    },
    isActive(route) {
      return this.$router.history.current.path == route;
    },
    async logOut() {
      await auth.signOut();
      this.$router.push('/login');
      this.drawer = false;
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
  position: relative;
}

#bar {
  position: absolute;
  top: 1rem;
  left: 1rem;
}
#logout {
  list-style: none;
  padding-left: 20px;
  color: rgb(255, 255, 255);
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  font-size: 14px;
  position: absolute;
  bottom: 1rem;
  > i {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
}
</style>
