<template>
  <div>
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
              {{ album.total_tracks }} tracks
            </p>
          </div>
        </div>
        <div v-if="!mobileActions" class="album-actions">
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
            disabled
            icon="el-icon-plus"
            @click="undoAlbum"
          >
            Added
          </el-button>
          <el-button class="add-button" plain icon="el-icon-arrow-right" @click="$emit('share')">
            Share
          </el-button>
        </div>
      </div>
      <el-button
        class="open-button"
        plain
        circle
        type="info"
        size="mini"
        icon="el-icon-connection"
        @click="openAlbum"
      />
    </div>
    <div v-if="mobileActions" class="album-actions">
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
        disabled
        icon="el-icon-plus"
        @click="undoAlbum"
      >
        Added
      </el-button>
      <el-button class="add-button" plain icon="el-icon-arrow-right" @click="$emit('share')">
        Share
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// Adding delay for improved UX in case of slow DB
const addingDelay = 500;
export default {
  name: 'AlbumSearch',
  props: {
    album: {
      type: Object,
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
  computed: {
    mobileActions() {
      return screen.width <= 560;
    },
    ...mapState({
      albumsInList: state => state.albumsInList,
      albumsInListened: state => state.albumsInListened,
    }),
  },
  mounted() {
    this.isAdded = this.albumsInList.map(item => item.id).includes(this.album.id);
    this.isListened = this.albumsInListened.map(item => item.id).includes(this.album.id);
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.openAlbum();
      } else if (command === 'b') {
        this.sendAlbum();
      }
    },
    openAlbum() {
      window.open(this.album.external_urls.spotify);
    },
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
}

.open-button {
  position: absolute;
  top: 0;
  right: 0;
}

@media (max-width: 560px) {
  .album-actions {
    margin-top: 1rem;
  }
  .album-title > p {
    font-size: 18px;
  }
}

@media (max-width: 500px) {
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
