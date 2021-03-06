import Vue from 'vue';
import VueRouter from 'vue-router';
import { auth } from '../firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'FindAlbums',
    component: () => import('../views/FindAlbums.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('../views/List.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/listened',
    name: 'Listened',
    component: () => import('../views/Listened.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/recommendations',
    name: 'Recommendations',
    component: () => import('../views/Recommendations.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
