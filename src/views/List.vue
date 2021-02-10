<template>
  <div class="content">
    <div class="header">
      <h1 ref="title">Your current list of albums, sorted by</h1>
      <el-select
        ref="sorting"
        v-model="sorting"
        class="select"
        placeholder="Sorting"
        @change="changeSorting"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="album-grid">
      <template v-for="(album, index) in albums">
        <album-list-item
          :key="`${index}-${album.id}`"
          :album="album"
          @deleted="updateAlbumsInList"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import AlbumListItem from '../components/AlbumListItem.vue';
export default {
  name: 'List',
  components: { AlbumListItem },
  data: function() {
    return {
      albums: [],
      options: [
        {
          value: 'title',
          label: 'Title',
        },
        {
          value: 'artist',
          label: 'Artist',
        },
        {
          value: 'year_asc',
          label: 'Oldest',
        },
        {
          value: 'year_des',
          label: 'Newest',
        },
      ],
      sorting: 'title',
      loading: true,
    };
  },
  computed: mapState({
    albumsInList: state => state.albumsInList,
    accessToken: state => state.accessToken,
  }),
  async mounted() {
    const loader = Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.5)' });
    const interval = setInterval(() => {
      this.getAlbumsInList();
      if (this.albumsInList && this.albumsInList.length >= 0) {
        clearInterval(interval);
        loader.close();
      }
    }, 800);
  },
  methods: {
    async getAlbumsInList() {
      // Get albums from spotify with ID's from vuex state
      let albumsLeftToGet = [...this.albumsInList];
      // Need to get 20 Albums at a time because of spotify's API limitations
      // https://developer.spotify.com/documentation/web-api/reference/#category-albums
      while (albumsLeftToGet.length > 0) {
        let queryString = '';
        for (let i = 0; i < 20 && i < albumsLeftToGet.length; i++) {
          queryString += albumsLeftToGet[i] + ',';
        }
        queryString = queryString.slice(0, -1);
        const response = await fetch(`https://api.spotify.com/v1/albums?ids=${queryString}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        const body = await response.json();
        for (let album of body.albums) {
          this.albums.push({
            name: album.name,
            artists: album.artists,
            images: album.images,
            release_date: album.release_date,
            total_tracks: album.total_tracks,
            id: album.id,
          });
          albumsLeftToGet.pop();
        }
        this.changeSorting();
      }
    },
    updateAlbumsInList(removedAlbumId) {
      this.albums = this.albums.filter(album => album.id != removedAlbumId);
    },
    changeSorting() {
      switch (this.sorting) {
        case 'title':
          this.albums.sort((a, b) => {
            if (a.name < b.name) return -1;
            return a.name > b.name ? 1 : 0;
          });
          break;
        case 'artist':
          this.albums.sort((a, b) => {
            if (a.artists[0].name < b.artists[0].name) return -1;
            return a.artists[0].name > b.artists[0].name ? 1 : 0;
          });
          break;
        case 'year_asc':
          this.albums.sort((a, b) => {
            if (a.release_date.substring(0, 4) < b.release_date.substring(0, 4)) return -1;
            return a.release_date.substring(0, 4) > b.release_date.substring(0, 4) ? 1 : 0;
          });
          break;
        case 'year_des':
          this.albums.sort((a, b) => {
            if (a.release_date.substring(0, 4) > b.release_date.substring(0, 4)) return -1;
            return a.release_date.substring(0, 4) < b.release_date.substring(0, 4) ? 1 : 0;
          });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-gap: 15px;

  > * {
    grid-row: 1;
  }
  > h1 {
    text-align: center;
    color: white;
  }
}

.album-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  justify-items: center;
  width: fit-content;
  margin: auto;
}

.select {
  background: none;
}
</style>
