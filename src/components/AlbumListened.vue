<template>
  <div class="album-body">
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
    <el-dropdown size="small" class="more-actions" @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-more"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-arrow-right" command="a">
          Share
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-delete" command="b">
          Remove
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
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
  computed: {
    mobileButtons: function() {
      return screen.width < 400;
    },
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.$emit('share');
      } else if (command === 'b') {
        this.removeAlbum();
      }
    },
    removeAlbum() {
      setTimeout(async () => {
        await this.removeFromAlbumsInListened(this.album.id);
        await this.setAlbumListenedDB();
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
.album-body {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  position: relative;
  width: 440px;
  grid-gap: 15px;
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
  width: 250px;
}
.album-image {
  width: 175px;
  height: 175px;
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

.more-actions {
  position: absolute;
  top: 0;
  right: 0;
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
@media (max-width: 440px) {
  .album-content {
    width: 180px;
  }
}

@media (max-width: 515px) {
  .album-body {
    width: 400px;
  }
}
@media (max-width: 465px) {
  .album-body {
    width: 380px;
  }
}

@media (max-width: 440px) {
  .album-body {
    width: 350px;
  }
}
@media (max-width: 405px) {
  .album-body {
    width: 320px;
  }
}
</style>
