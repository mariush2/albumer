import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albums: [],
    nextUrl: '',
    searching: false,
  },
  mutations: {
    changeAccessToken(state, payload) {
      state.accessToken = payload.token;
    },
    addAlbums(state, payload) {
      state.albums.push(...payload.albums);
    },
    changeAlbums(state, payload) {
      state.albums = payload.albums;
    },
    changeNextUrl(state, payload) {
      state.nextUrl = payload.next;
    },
    changeSearching(state, payload) {
      state.searching = payload.searching;
    },
  },
  actions: {
    async refreshAccessToken({ commit, state }) {
      const response = await fetch('http://localhost:3005/spotify/token');
      const body = await response.json();
      try {
        commit('changeAccessToken', { token: body.access_token });
      } catch (e) {
        console.error(e);
      }
    },
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
      if (body.albums && body.albums.items.length === 0) {
        body.albums.items.push('none');
      }
      try {
        commit('changeAlbums', { albums: body.albums.items });
        commit('changeNextUrl', { next: body.albums.next });
        commit('changeSearching', { searching: false });
      } catch (e) {
        console.error(e);
      }
    },
    async nextAlbums({ commit, state }) {
      const response = await fetch(`${state.nextUrl}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      const body = await response.json();
      const newAlbums = body.albums.items;
      let adding = [];
      const currentLength = state.albums.length;
      const last10 = state.albums.slice(currentLength - 10, currentLength).map(album => album.id);
      for (let album of newAlbums) {
        if (!last10.includes(album.id)) {
          adding.push(album);
        } else {
          break;
        }
      }
      if (adding.length > 0) commit('addAlbums', { albums: adding });
    },
    setSearching({ commit }) {
      commit('changeSearching', { searching: true });
    },
  },
});
