<template>
  <div class="content">
    <div class="header">
      <h1 ref="title">Albums you've listened to so far, sorted by</h1>
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
        <album-listened
          :key="`${index}-${album.id}`"
          :album="album"
          @deleted="updateAlbumsInListened"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';
import AlbumListened from '../components/AlbumListened.vue';
export default {
  name: 'Listened',
  components: { AlbumListened },
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
          label: 'Oldest - released',
        },
        {
          value: 'year_des',
          label: 'Newest - released',
        },
        {
          value: 'added_asc',
          label: 'Oldest - listened',
        },
        {
          value: 'added_des',
          label: 'Newest - listened',
        },
      ],
      sorting: 'added_des',
      loading: true,
    };
  },
  computed: mapState({
    albumsInListened: state => state.albumsInListened,
    accessToken: state => state.accessToken,
  }),
  async mounted() {
    const loader = Loading.service({
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.5)',
    });
    await this.refreshAlbumsInListened();
    const interval = setInterval(() => {
      if (this.albumsInListened && this.albumsInListened.length >= 0) {
        clearInterval(interval);
        this.albums = this.albumsInListened;
        this.changeSorting();
        loader.close();
      }
    }, 800);
  },
  methods: {
    updateAlbumsInListened(removedAlbumId) {
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
        case 'added_asc':
          this.albums.sort((a, b) => {
            if (new Date(a.added_date) < new Date(b.added_date)) return -1;
            return new Date(a.added_date) > new Date(b.added_date) ? 1 : 0;
          });
          break;
        case 'added_des':
          this.albums.sort((a, b) => {
            if (new Date(a.added_date) > new Date(b.added_date)) return -1;
            return new Date(a.added_date) < new Date(b.added_date) ? 1 : 0;
          });
          break;
      }
    },
    ...mapActions(['refreshAlbumsInListened']),
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding-top: 4rem;
}
.header {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-gap: 15px;

  > h1 {
    text-align: left;
    color: white;
    font-size: 150%;
  }
}

.album-grid {
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 1rem;
  grid-gap: 15px;
  width: fit-content;
  justify-items: center;
  margin: auto;
}

.select {
  background: none;
}

@media (max-width: 700px) {
  .header > h1 {
    margin-bottom: 0;
  }
}
@media (min-width: 700px) {
  .header {
    > * {
      grid-row: 1;
    }
    > h1 {
      text-align: center;
    }
  }
}
@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
