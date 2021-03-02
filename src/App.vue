<template>
  <div id="app" :style="!mobileButtons ? 'padding-top: 3rem' : ''">
    <template v-if="$router.history.current.path != '/login'">
      <template v-if="mobileButtons">
        <div id="mobile-bar">
          <el-button
            :class="activeColor('/profile')"
            icon="el-icon-user"
            type="primary"
            @click="handleClick('/profile')"
          />
          <el-button
            :class="activeColor('/')"
            icon="el-icon-search"
            type="primary"
            @click="handleClick('/')"
          />
          <el-button
            :class="activeColor('/list')"
            icon="el-icon-files"
            type="primary"
            @click="handleClick('/list')"
          />
          <el-button
            :class="activeColor('/listened')"
            icon="el-icon-check"
            type="primary"
            @click="handleClick('/listened')"
          />
          <el-button
            :class="activeColor('/recommendations')"
            icon="el-icon-receiving"
            type="primary"
            @click="handleClick('/recommendations')"
          />
        </div>
      </template>
      <template v-else>
        <div id="bar">
          <el-button
            circle
            icon="el-icon-menu"
            size="medium"
            type="default"
            @click="drawer = true"
          />
        </div>
        <el-drawer :visible.sync="drawer" size="min-content" :show-close="false" direction="ltr">
          <template slot="title">
            <img class="drawer-title" src="@/assets/written_logo.svg" />
          </template>
          <el-menu
            background-color="#b65b6b"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-active="defaultActive"
          >
            <el-menu-item index="0" @click="handleClick('/profile')">
              <i class="el-icon-user"></i>
              <span>Profile</span>
            </el-menu-item>
            <el-menu-item index="1" @click="handleClick('/')">
              <i class="el-icon-search"></i>
              <span>Find albums</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handleClick('/list')">
              <i class="el-icon-files"></i>
              <span>List</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handleClick('/listened')">
              <i class="el-icon-check"></i>
              <span>Listened</span>
            </el-menu-item>
            <el-menu-item index="4" @click="handleClick('/recommendations')">
              <i class="el-icon-receiving"></i>
              <span>Recommendations</span>
            </el-menu-item>
          </el-menu>
          <li id="logout" @click="logOut">
            <i class="el-icon-unlock"></i>
            <span>Log out</span>
          </li>
        </el-drawer>
      </template>
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
  computed: {
    mobileButtons() {
      return screen.width <= 560 && window.matchMedia('(display-mode: standalone)').matches;
    },
  },
  mounted: function() {
    setTimeout(() => {
      switch (this.$router.history.current.path) {
        case '/profile':
          this.defaultActive = '0';
          break;
        case '/':
          this.defaultActive = '1';
          break;
        case '/list':
          this.defaultActive = '2';
          break;
        case '/listened':
          this.defaultActive = '3';
          break;
        case '/recommendations':
          this.defaultActive = '4';
          break;
      }
    }, 200);
  },
  methods: {
    activeColor(route) {
      if (route === this.$router.history.current.path) return 'active';
      return '';
    },
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

#app {
  padding-bottom: 4rem;
  overflow: hidden;
}

#mobile-bar {
  position: fixed;
  border-top: 1px solid transparentize(#eff1f3, 0.6);
  background: #b65b6b;
  padding-bottom: 2rem;
  z-index: 1000;
  width: 100%;
  left: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  text-align: center;
  align-items: center;
  height: 3rem;

  > button {
    font-size: 22px;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    &:hover {
      background: none;
      border: none;
    }
  }

  .active {
    color: #ffd04b;
  }
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
.drawer-title {
  height: 50px;
}
</style>
