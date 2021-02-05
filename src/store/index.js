import Vue from 'vue';
import Vuex from 'vuex';
import { auth, db } from '../firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albumsInSearch: [],
    albumsInList: [],
    nextUrl: '',
    searching: false,
    limit: 20,
    foundAll: false,
    confirmationResult: null,
  },
  mutations: {
    changeAccessToken(state, payload) {
      state.accessToken = payload.token;
    },
    addAlbums(state, payload) {
      state.albumsInSearch.push(...payload.albumsInSearch);
    },
    emptyAlbums(state) {
      state.albumsInSearch = new Array(state.limit).fill(0);
    },
    changeAlbums(state, payload) {
      state.albumsInSearch = payload.albumsInSearch;
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
    setConfirmationResult(state, payload) {
      state.confirmationResult = payload.confirmationResult;
    },
    setAlbumsInList(state, payload) {
      state.albumsInList = payload.albums;
    },
  },
  actions: {
    async setAlbumListDB({ state }) {
      // Write to database
      const userId = auth.currentUser.uid;
      await db.ref('users/' + userId).set({
        albums: state.albumsInList,
      });
    },
    removeFromAlbumsInList({ commit, state }, album) {
      commit('setAlbumsInList', { albums: state.albumsInList.filter(item => item != album) });
    },
    addToAlbumsInList({ commit, state }, album) {
      commit('setAlbumsInList', { albums: [...state.albumsInList, album] });
    },
    async refreshAlbumsInList({ commit }) {
      const userId = auth.currentUser.uid;
      await db
        .ref(`/users/${userId}`)
        .once('value')
        .then(snapshot => {
          const currentAlbums = snapshot.val().albums;
          if (currentAlbums.length > 0) {
            currentAlbums;
            commit('setAlbumsInList', { albums: currentAlbums });
          } else this.currentAlbums = [];
        });
    },
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
      commit('changeAlbums', { albumsInSearch: body.albums.items });
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
      const currentAlbums = state.albumsInSearch.map(album => {
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
        commit('addAlbums', { albumsInSearch: adding });
        commit('changeNextUrl', { next: body.albums.next });
      } else {
        commit('changeFoundAll', { found: true });
      }
    },
    async loginUsingPhone({ commit }, form) {
      const confirmationResult = await auth.signInWithPhoneNumber(form.phone, form.recaptcha);
      commit('setConfirmationResult', { confirmationResult });
    },
    startSearching({ commit }) {
      commit('changeSearching', { searching: true });
    },
    setEmptyAlbums({ commit }) {
      commit('emptyAlbums');
    },
  },
});
