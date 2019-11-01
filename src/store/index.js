import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albums: [],
  },
  mutations: {
    changeAccessToken(state, payload) {
      state.accessToken = payload.token;
    },
    changeAlbums(state, payload) {
      state.albums = payload.albums;
    },
  },
  actions: {
    async findAlbums({ commit, store }, name) {
      const response = fetch(`https://api.spotify.com/v1/search?q=${name}&type=album&limit=10`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${store.accessToken}`,
        },
      });
      commit('changeAlbums', { albums: response.body });
    },
  },
});
