<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-container>
          <v-row justify="center" align="center">
            <h1>Find your next album</h1>
          </v-row>
          <v-row justify="center" align="center">
            <Searchbar placeholder="Find an album..." />
          </v-row>
        </v-container>
      </v-row>
      <template>
        <v-row justify="center" align="center">
          <div class="album-grid">
            <template v-for="album in albums">
              <v-skeleton-loader
                :key="album.id"
                light
                min-width="360px"
                width="100%"
                max-width="450px"
                type="article"
                transition="fade"
                :loading="searching"
              >
                <Album :album="album" />
              </v-skeleton-loader>
            </template>
          </div>
        </v-row>
      </template>
    </v-container>
  </v-main>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Album from '@/components/Album.vue';
import Searchbar from '@/components/Searchbar.vue';

export default {
  name: 'Home',
  components: {
    Album,
    Searchbar,
  },
  computed: mapState({
    albums: state => state.albums,
    searching: state => state.searching,
  }),
  created() {
    // Attach event listener to html-tag
    window.addEventListener('scroll', this.onScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight },
      },
    }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.nextAlbums();
      }
    },
    ...mapActions(['nextAlbums']),
  },
};
</script>

<style lang="scss" scoped>
.album-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 12px;
}

.result-text {
  text-align: center;
  font-size: 24px;
}

@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
