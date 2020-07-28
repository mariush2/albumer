import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albums: [],
    nextUrl: '',
    searching: false,
    limit: 20,
    foundAll: false,
    isAuthenticated: false,
  },
  mutations: {
    changeAccessToken(state, payload) {
      state.accessToken = payload.token;
    },
    addAlbums(state, payload) {
      state.albums.push(...payload.albums);
    },
    emptyAlbums(state) {
      state.albums = new Array(state.limit).fill(0);
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
    changeFoundAll(state, payload) {
      state.foundAll = payload.found;
    },
    setAuthenticated(state) {
      state.isAuthenticated = true;
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
        `https://api.spotify.com/v1/search?q="${name.replace(/\s+/g, '%20')}"&type=album&limit=${
          state.limit
        }`,
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
      commit('changeAlbums', { albums: body.albums.items });
      commit('changeNextUrl', { next: body.albums.next });
      commit('changeFoundAll', { found: false });
      commit('changeSearching', { searching: false });
    },
    async nextAlbums({ commit, state }) {
      if (state.foundAll) {
        return;
      }
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
      const currentAlbums = state.albums.map(album => {
        return {
          id: album.id,
          name: album.name,
        };
      });

      for (let album of newAlbums) {
        let exists = false;
        for (let oldAlbum of currentAlbums) {
          if (album.name === oldAlbum.name && album.id === oldAlbum.id) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          adding.push(album);
        }
      }
      if (adding.length > 0) {
        commit('addAlbums', { albums: adding });
        commit('changeNextUrl', { next: body.albums.next });
      } else {
        commit('changeFoundAll', { found: true });
      }
    },
    async setUser({ commit, state }, user) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      document.cookie = `userPhone=${user.phoneNumber},expires=${expireDate}`;
      commit('setAuthenticated');
    },
    startSearching({ commit }) {
      commit('changeSearching', { searching: true });
    },
    setEmptyAlbums({ commit }) {
      commit('emptyAlbums');
    },
  },
});
