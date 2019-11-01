import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albums: [],
    nextUrl: '',
  },
  mutations: {
    changeAccessToken(state, payload) {
      state.accessToken = payload.token;
    },
    changeAlbums(state, payload) {
      state.albums = payload.albums;
    },
    changeNextUrl(state, payload) {
      state.nextUrl = payload.next;
    },
  },
  actions: {
    async findAlbums({ commit, state }, name) {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${name}&type=album&limit=10`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );
      const body = await response.json();
      commit('changeAlbums', { albums: body.albums.items });
      commit('changeNextUrl', { next: body.albums.next });
    },
    async nextAlbums({ commit, state }) {
      const response = await fetch(`${state.nextUrl}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      const body = await response.json();
      commit('changeAlbums', { albums: body.albums.items });
    },
  },
});
