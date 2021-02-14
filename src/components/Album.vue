<template>
  <el-card shadow="never" class="card">
    <div class="card-body">
      <div class="album-image">
        <el-image fit="fill" :src="album.images[0].url" />
      </div>
      <div class="album-content">
        <div>
          <div class="album-title">
            <p>{{ album.name }}</p>
          </div>
          <div class="album-artist">
            <p>by {{ album.artists[0].name }}</p>
          </div>
          <div class="album-info">
            <p>
              {{ album.release_date.substring(0, 4) }}
              <br />
              {{ album.total_tracks }} tracks
            </p>
          </div>
        </div>
        <div class="album-action">
          <el-button
            v-if="isListened"
            class="add-button"
            type="success"
            plain
            disabled
            icon="el-icon-check"
          >
            Listened
          </el-button>
          <el-button
            v-else-if="!isAdded && !isAdding"
            class="add-button"
            icon="el-icon-plus"
            @click="addAlbum"
          >
            Add
          </el-button>
          <el-button v-else-if="isAdding" class="add-button" disabled icon="el-icon-loading">
            Adding
          </el-button>
          <el-button
            v-else
            class="add-button"
            type="success"
            plain
            icon="el-icon-check"
            @click="undoAlbum"
          >
            Added
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';
// Adding delay for improved UX in case of slow DB
const addingDelay = 500;
export default {
  name: 'Album',
  props: {
    album: {
      type: Object,
      required: true,
    },
    albumsInList: {
      type: Array,
      required: true,
    },
    albumsInListened: {
      type: Array,
      required: true,
    },
  },
  data: function() {
    return {
      isAdded: false,
      isAdding: false,
      isListened: false,
    };
  },
  mounted() {
    this.isAdded = this.albumsInList.map(item => item.id).includes(this.album.id);
    this.isListened = this.albumsInListened.map(item => item.id).includes(this.album.id);
  },
  methods: {
    async addAlbum() {
      this.isAdding = true;
      setTimeout(async () => {
        if (!this.isAdded) {
          this.isAdded = true;
          await this.addToAlbumsInList({
            artists: this.album.artists,
            images: this.album.images,
            name: this.album.name,
            open_url: this.album.external_urls.spotify,
            release_date: this.album.release_date,
            total_tracks: this.album.total_tracks,
            added_date: new Date().toJSON(),
            id: this.album.id,
          });
          await this.setAlbumListDB();
          // Add album
          this.isAdding = false;
        }
      }, addingDelay);
    },
    async undoAlbum() {
      this.isAdded = false;
      await this.removeFromAlbumsInList(this.album.id);
      await this.setAlbumListDB();
    },
    ...mapActions(['setAlbumListDB', 'addToAlbumsInList', 'removeFromAlbumsInList']),
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  position: relative;
  grid-gap: 15px;
  max-width: 380px;
}

.card {
  padding: 0;
  position: relative;
}

p {
  margin: 0;
  font-size: 100%;
  margin-bottom: 2px;
}
.album-content {
  display: grid;
  grid-gap: 15px;
  height: 100%;
}
.album-image {
  width: 165px;
  height: 165px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
}
.album-title,
.album-artist,
.album-info {
  height: min-content;
}

.album-title > p {
  font-weight: 500;
}
.album-artist > p {
  font-weight: 400;
}
.album-info > p {
  font-weight: 300;
}

.album-action {
  display: flex;
  flex-direction: column-reverse;
}

@media (max-width: 400px) {
  .album-image {
    width: 150px;
    height: 150px;
  }
}
</style>
