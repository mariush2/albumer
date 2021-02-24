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
        <div class="sender-info">
          <p>
            Recommended by
            <br />
            <span>{{ album.sender }}</span>
          </p>
        </div>
      </div>
      <el-button
        class="open-button"
        plain
        circle
        type="info"
        size="mini"
        icon="el-icon-connection"
        @click="open"
      />
    </div>
    <div class="album-actions">
      <el-button v-if="!isAccepting" plain icon="el-icon-check" @click="accept">
        Accept and Add
      </el-button>
      <el-button v-else plain type="success" icon="el-icon-loading" disabled>
        Accepting
      </el-button>
      <el-button v-if="!isDeclining" plain icon="el-icon-close" @click="decline">
        Decline
      </el-button>
      <el-button v-else plain type="danger" icon="el-icon-loading" disabled>
        Declining
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// Adding delay for improved UX in case of slow DB
const actionDelay = 500;
export default {
  name: 'AlbumRecommendation',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      isAccepting: false,
      isDeclining: false,
    };
  },
  methods: {
    accept() {
      this.isAccepting = true;
      setTimeout(async () => {
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
        // Remove from recommendations
        await this.removeFromRecommendations(this.album.id);
        this.$emit('updated');
        await this.setRecommendationsDB();
        this.isAccepting = false;
      }, actionDelay);
    },
    decline() {
      this.isDeclining = true;
      setTimeout(async () => {
        await this.removeFromRecommendations(this.album.id);
        this.$emit('updated');
        await this.setRecommendationsDB();
        this.isDeclining = false;
      }, actionDelay);
    },
    open() {
      window.open(this.album.open_url);
    },
    ...mapActions([
      'setRecommendationsDB',
      'removeFromRecommendations',
      'addToAlbumsInList',
      'setAlbumListDB',
    ]),
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
.album-info,
.sender-info {
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
.sender-info {
  align-self: flex-end;
  > p {
    font-weight: 300;
    > span {
      font-weight: 500;
    }
  }
}

.album-actions {
  grid-template-columns: 1fr 1fr;
  display: grid;
  align-self: flex-end;
  margin-top: 1rem;
}

.open-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
