<template>
  <el-card shadow="never" class="card">
    <div class="card-body">
      <div class="album-image">
        <el-image fit="fill" :src="album.images[0].url" />
      </div>
      <div class="album-content">
        <div class="album-title">
          <h2>{{ album.name }}</h2>
        </div>
        <div class="album-artist">
          <h3>by {{ album.artists[0].name }}</h3>
        </div>
        <div class="album-info">
          <h5>
            {{ album.release_date.substring(0, 4) }}
            <br />
            {{ album.total_tracks }} tracks
          </h5>
        </div>
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
    this.isAdded = this.albumsInList.includes(this.album.id);
    this.isListened = this.albumsInListened.includes(this.album.id);
  },
  methods: {
    async addAlbum() {
      this.isAdding = true;
      setTimeout(async () => {
        if (!this.isAdded) {
          this.isAdded = true;
          await this.addToAlbumsInList(this.album.id);
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
  position: relative;
}

.card {
  max-width: 500px;
  width: 100%;
  padding: 0;
  position: relative;
}

.add-button {
  width: 100%;
  position: absolute;
  bottom: 0;
}

h2,
h3,
h5 {
  margin: 0;
  font-size: 100%;
}
.album-content {
  margin-left: 1rem;
  height: 100%;
  position: relative;
}
.album-image {
  width: 165px;
  height: 165px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
}
.album-title {
  width: 100%;
  margin-bottom: 5px;
}
.album-artist {
  width: 100%;
  margin-bottom: 5px;
}
.album-info {
  width: 100%;
}

@media (max-width: 400px) {
  .album-image {
    width: 150px;
    height: 150px;
  }
}
</style>
