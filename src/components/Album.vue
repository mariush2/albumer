<template>
  <v-card light elevation="0" height="150px" min-width="360px" width="100%" max-width="450px">
    <div class="album-content">
      <v-avatar class="album-image ma-3" size="125" tile>
        <v-img :src="album.images[0].url"></v-img>
      </v-avatar>
      <div class="album-text">
        <div class="album-name text-truncate">{{ album.name }}</div>
        <div class="album-artist text-truncate">
          by
          <span>{{ album.artists[0].name }}</span>
        </div>
        <div class="album-info">
          {{ album.release_date.substring(0, 4) }}, {{ album.total_tracks }} songs
        </div>
        <v-btn text block elevation="0" small class="mt-4">
          <v-icon left>fa-plus</v-icon>
          Add to list
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Album',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.album-content {
  display: grid;
  grid-template-columns: 1fr 4fr;
  width: 100%;
}

.album-text {
  padding: 12px;
  max-width: 100%;
  min-width: 0;

  > .album-name {
    font-weight: 600;
    font-size: 18px;
  }

  > .album-artist {
    font-weight: 200;
    font-size: 14px;

    > span {
      font-weight: 400;
      font-size: 16px;
    }
  }

  > .album-info {
    font-size: 14px;
    font-weight: 200;
  }
}

.album-image {
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>