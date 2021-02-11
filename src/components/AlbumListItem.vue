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
        <div class="album-actions">
          <el-button
            v-if="!isListened"
            type="success"
            plain
            icon="el-icon-check"
            @click="markListened"
          >
            Listened
          </el-button>
          <el-button v-else type="success" plain icon="el-icon-loading">
            Marking as listened
          </el-button>
          <el-button
            v-if="!isRemoving"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="removeAlbum"
          />
          <el-button v-else class="remove-button" type="danger" plain icon="el-icon-loading" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';
// Adding delay for improved UX in case of slow DB
const actionDelay = 500;
export default {
  name: 'Album',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      isRemoving: false,
      isListened: false,
    };
  },
  methods: {
    removeAlbum() {
      this.isRemoving = true;
      setTimeout(async () => {
        await this.removeFromAlbumsInList(this.album.id);
        await this.setAlbumListDB();
        this.isRemoving = false;
        this.$emit('deleted', this.album.id);
      }, actionDelay);
    },
    markListened() {
      this.isListened = true;
      setTimeout(async () => {
        await this.addToAlbumsInListened(this.album.id);
        await this.removeFromAlbumsInList(this.album.id);
        await this.setAlbumListenedDB();
        await this.setAlbumListDB();
        this.isListened = false;
        this.$emit('deleted', this.album.id);
      }, actionDelay);
    },
    ...mapActions([
      'addToAlbumsInListened',
      'setAlbumListenedDB',
      'removeFromAlbumsInList',
      'setAlbumListDB',
    ]),
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
  width: 140px;
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
.album-actions {
  display: grid;
  grid-template-columns: 4fr 1fr;
  width: 100%;
  position: absolute;
  bottom: 0;
}
@media (min-width: 1000px) {
  .album-image {
    width: 165px;
    height: 165px;
  }
}
</style>
