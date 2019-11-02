<template>
  <v-content>
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
      <template v-if="searching && albums.length === previousLength">
        <v-row justify="center" align="center">
          <div class="album-grid">
            <template v-for="i in 6">
              <v-expand-transition :key="`${i}-skeleton-album`">
                <v-skeleton-loader
                  light
                  min-width="360px"
                  width="100%"
                  max-width="450px"
                  type="article"
                />
              </v-expand-transition>
            </template>
          </div>
        </v-row>
      </template>
      <template v-else-if="albums[0] === 'none'">
        <h1>We couldn't find that album unfortunalty...</h1>
      </template>
      <template v-else-if="albums.length > 0">
        <v-row justify="center" align="center">
          <div class="album-grid">
            <template v-for="album in albums">
              <v-expand-transition :key="album.id">
                <Album :album="album" />
              </v-expand-transition>
            </template>
          </div>
        </v-row>
      </template>
    </v-container>
  </v-content>
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
  data: function() {
    return {
      started: false,
      previousLength: 0,
    };
  },
  computed: mapState({
    albums: state => state.albums,
    searching: state => state.searching,
  }),
  watch: {
    albums: function() {
      this.previousLength = this.albums.length;
      this.started = false;
    },
  },
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

@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
