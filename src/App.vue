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
            <i class="el-icon-search"></i>
            <span>Find albums</span>
          </el-menu-item>
          <el-menu-item index="2" @click="handleClick('/list')">
            <i class="el-icon-document"></i>
            <span>Current list</span>
          </el-menu-item>
          <el-menu-item index="3" @click="handleClick('/listened')">
            <i class="el-icon-document-checked"></i>
            <span>Listened</span>
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
      defaultActive: '1',
    };
  },
  mounted: function() {
    setTimeout(() => {
      switch (this.$router.history.current.path) {
        case '/':
          this.defaultActive = '1';
          break;
        case '/list':
          this.defaultActive = '2';
          break;
        case '/listened':
          this.defaultActive = '3';
          break;
      }
    }, 200);
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
  position: fixed;
  z-index: 1000;
  background: #b65b6b;
  top: 1rem;
  left: 1rem;
  border-radius: 3rem;
  box-shadow: 0px 0px 4px 15px #b65b6b;
}
#logout {
  width: 100%;
  list-style: none;
  padding-left: 20px;
  color: rgb(255, 255, 255);
  height: 56px;
  line-height: 56px;
  transition: background-color 0.3s;
  cursor: pointer;
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
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
