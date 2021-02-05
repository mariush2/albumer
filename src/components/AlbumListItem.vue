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
          v-if="!isRemoving"
          class="remove-button"
          type="danger"
          plain
          icon="el-icon-delete"
          @click="removeAlbum"
        >
          Remove
        </el-button>
        <el-button
          v-else
          class="remove-button"
          type="danger"
          plain
          icon="el-icon-loading"
          @click="removeAlbum"
        >
          Removing
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';
// Adding delay for improved UX in case of slow DB
const removingDelay = 500;
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
      }, removingDelay);
    },
    ...mapActions(['removeFromAlbumsInList', 'setAlbumListDB']),
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

.remove-button {
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
</style>
