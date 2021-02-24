import Vue from 'vue';
import Vuex from 'vuex';
import { auth, db, functionsServer } from '../firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    albumsInSearch: [],
    albumsInList: null,
    albumsInListened: [],
    friendsList: [],
    recommendations: [],
    nextUrl: '',
    searching: false,
    limit: 5,
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
    setAlbumsInListened(state, payload) {
      state.albumsInListened = payload.albums;
    },
    setFriendsList(state, payload) {
      state.friendsList = payload.friends;
    },
    setRecommendations(state, payload) {
      state.recommendations = payload.albums;
    },
  },
  actions: {
    async refreshRecommendations({ commit }) {
      const userId = auth.currentUser.uid;
      await db
        .ref(`/recommendations/${userId}`)
        .once('value')
        .then(snapshot => {
          const currentList = snapshot.val() != null ? snapshot.val().albums : [];
          commit('setRecommendations', {
            albums: currentList,
          });
        });
    },
    async setRecommendationsDB({ state }) {
      // Write to database
      const userId = auth.currentUser.uid;
      await db.ref('recommendations/' + userId).set({
        albums: state.recommendations,
      });
    },
    removeFromRecommendations({ commit, state }, album) {
      commit('setRecommendations', {
        albums: state.recommendations.filter(item => item.id != album),
      });
    },
    async refreshAlbumsInList({ commit }) {
      const userId = auth.currentUser.uid;
      await db
        .ref(`/list/${userId}`)
        .once('value')
        .then(snapshot => {
          const currentList = snapshot.val() != null ? snapshot.val().albums : [];
          commit('setAlbumsInList', {
            albums: currentList,
          });
        });
    },
    async setAlbumListDB({ state }) {
      // Write to database
      const userId = auth.currentUser.uid;
      await db.ref('list/' + userId).set({
        albums: state.albumsInList,
      });
    },
    removeFromAlbumsInList({ commit, state }, album) {
      commit('setAlbumsInList', { albums: state.albumsInList.filter(item => item.id != album) });
    },
    addToAlbumsInList({ commit, state }, album) {
      commit('setAlbumsInList', { albums: [...state.albumsInList, album] });
    },
    async refreshAlbumsInListened({ commit }) {
      const userId = auth.currentUser.uid;
      await db
        .ref(`/listened/${userId}`)
        .once('value')
        .then(snapshot => {
          const currentListened = snapshot.val() != null ? snapshot.val().albums : [];
          commit('setAlbumsInListened', {
            albums: currentListened,
          });
        });
    },
    async setAlbumListenedDB({ state }) {
      // Write to database
      const userId = auth.currentUser.uid;
      await db.ref('listened/' + userId).set({
        albums: state.albumsInListened,
      });
    },
    addToAlbumsInListened({ commit, state }, album) {
      commit('setAlbumsInListened', { albums: [...state.albumsInListened, album] });
    },
    removeFromAlbumsInListened({ commit, state }, album) {
      commit('setAlbumsInListened', {
        albums: state.albumsInListened.filter(item => item.id != album),
      });
    },
    async refreshFriendsList({ commit }) {
      const userId = auth.currentUser.uid;
      await db
        .ref(`/friends/${userId}`)
        .once('value')
        .then(snapshot => {
          const currentList = snapshot.val() != null ? snapshot.val().friends : [];
          commit('setFriendsList', {
            friends: currentList,
          });
        });
    },
    async setFriendsListInDB({ state }) {
      // Write to database
      const userId = auth.currentUser.uid;
      await db.ref('friends/' + userId).set({
        friends: state.friendsList,
      });
    },
    addToFriendsList({ commit, state }, friend) {
      commit('setFriendsList', { friends: [...state.friendsList, friend] });
    },
    removeFromFriendsList({ commit, state }, friend) {
      commit('setFriendsList', { friends: state.friendsList.filter(item => item.uid != friend) });
    },
    async refreshAccessToken({ commit, state }) {
      const userId = await auth.currentUser.getIdToken();
      const headers = new Headers({
        method: 'GET',
        Authorization: `Bearer ${userId}`,
        'Access-Control-Allow-Origin': functionsServer,
        'Access-Control-Allow-Credentials': 'true',
      });
      const response = await fetch(`${functionsServer}/app/spotifyToken`, {
        headers,
      });
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
      let newAlbums = body.albums.items;
      let adding = [];
      const currentLength = state.albumsInSearch.length;
      const currentAlbums = state.albumsInSearch.map(album => {
        return {
          id: album.id,
          name: album.name,
        };
      });

      newAlbums = newAlbums.filter(album => !state.albumsInListened.includes(album.id));

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
    resetConfirmationResult({ commit }) {
      commit('setConfirmationResult', { confirmationResult: null });
    },
  },
});
