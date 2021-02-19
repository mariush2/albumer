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
              {{ album.total_tracks }} {{ album.total_tracks == 1 ? 'track' : 'tracks' }}
            </p>
          </div>
        </div>
        <div class="album-actions">
          <el-button type="info" plain icon="el-icon-connection" @click="openAlbum">
            Open
          </el-button>
        </div>
      </div>
    </div>
    <el-button
      v-if="!isRemoving"
      class="remove-button"
      plain
      circle
      type="danger"
      size="mini"
      icon="el-icon-delete"
      @click="removeAlbum"
    />
    <el-button
      v-else
      class="remove-button"
      plain
      circle
      type="danger"
      size="mini"
      icon="el-icon-loading"
    />
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';
// Adding delay for improved UX in case of slow DB
const actionDelay = 500;
export default {
  name: 'AlbumListened',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      isRemoving: false,
    };
  },
  computed: {
    mobileButtons: function() {
      return screen.width < 400;
    },
  },
  methods: {
    removeAlbum() {
      this.isRemoving = true;
      setTimeout(async () => {
        await this.removeFromAlbumsInListened(this.album.id);
        await this.setAlbumListenedDB();
        this.isRemoving = false;
        this.$emit('deleted', this.album.id);
      }, actionDelay);
    },
    openAlbum() {
      window.open(this.album.open_url);
    },
    ...mapActions(['setAlbumListenedDB', 'removeFromAlbumsInListened']),
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
  width: 100%;
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
  padding-right: 28px;
}
.album-artist > p {
  font-weight: 400;
}
.album-info > p {
  font-weight: 300;
}

.album-actions {
  grid-template-columns: 1fr;
  display: grid;
  align-self: flex-end;
}

.remove-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

@media (max-width: 450px) {
  .album-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 440px) {
  .album-image {
    width: 145px;
    height: 145px;
  }
}

@media (max-width: 405px) {
  .album-image {
    width: 125px;
    height: 125px;
  }
}
</style>
