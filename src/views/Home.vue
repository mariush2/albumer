<template>
  <v-content>
    <v-container fluid fill-height>
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
        <v-container fluid>
          <template v-for="i in 5">
            <v-expand-transition :key="`${i}-skeleton-album`">
              <v-row class="ma-2" justify="center" align="center">
                <v-skeleton-loader light min-width="360px" max-width="450px" type="article" />
              </v-row>
            </v-expand-transition>
          </template>
        </v-container>
      </template>
      <template v-else-if="albums[0] === 'none'">
        <h1>We couldn't find that album unfortunalty...</h1>
      </template>
      <template v-else-if="albums.length > 0">
        <v-container fluid>
          <template v-for="album in albums">
            <v-expand-transition :key="album.id">
              <v-row class="ma-2" justify="center" align="center">
                <Album :album="album" />
              </v-row>
            </v-expand-transition>
          </template>
        </v-container>
      </template>
    </v-container>
  </v-content>
</template>

<script>
import { mapState } from 'vuex';

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
};
</script>
