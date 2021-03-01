<template>
  <div class="content">
    <div class="header">
      <h1 ref="title">
        <i class="el-icon-document-checked" />
        Albums you've listened to
      </h1>
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
    <div v-if="albums.length > 0" class="album-grid">
      <transition-group name="albums" tag="div" appear>
        <album
          v-for="album in albums"
          :key="album.id"
          class="albums-item"
          :album="album"
          @deleted="updateAlbumsInListened"
        />
      </transition-group>
    </div>
    <div v-else-if="!loading" class="no-albums">
      <p>
        You haven't checked any albums as listened yet,
        <br />
        head over to the
        <el-link class="link" icon="el-icon-document" href="/list" type="info">List</el-link>
        page
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';
import Album from '../components/Album.vue';
export default {
  name: 'Listened',
  components: { Album },
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
        this.loading = false;
      }
    }, 800);
  },
  methods: {
    updateAlbumsInListened(removedAlbumId) {
      const removeIndex = this.albums.findIndex(album => album.id == removedAlbumId);
      this.albums.splice(removeIndex, 1);
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

.album-grid > div {
  z-index: 1;
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

.no-albums {
  margin-top: 2rem;
  > p {
    color: white;
    text-align: center;
    font-size: 24px;
    line-height: 40px;
    > .link {
      font-size: 24px;
    }
  }
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

.albums-item {
  display: inline-block;
  transition: all 1s;
}
.albums-move {
  transition: transform 1s;
}
.albums-enter {
  transform: translateX(100%);
}
.albums-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.albums-leave-active {
  position: absolute;
  transition: all 1s;
}
</style>
