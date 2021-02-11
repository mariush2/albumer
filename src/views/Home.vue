<template>
  <div>
    <div class="header">
      <h1>Find your next album</h1>
      <Searchbar placeholder="Find an album..." @search="updateSearchString" />
    </div>
    <div>
      <template v-if="searching">
        <div class="album-grid">
          <template v-for="index in 8">
            <Album-skeleton :key="index" />
          </template>
        </div>
      </template>
      <template v-else-if="albumsInSearch[0] != 'none'">
        <div class="album-grid">
          <template v-for="(album, index) in albumsInSearch">
            <Album
              :key="`album-${index}`"
              :album="album"
              :albums-in-list="albumsInList"
              :albums-in-listened="albumsInListened"
            />
          </template>
        </div>
      </template>
      <template v-else-if="searchString.length > 0">
        <div class="result">
          <h1 class="result-text">Couldn't find any albums</h1>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Album from '@/components/Album.vue';
import AlbumSkeleton from '@/components/AlbumSkeleton.vue';
import Searchbar from '@/components/Searchbar.vue';

export default {
  name: 'Home',
  components: {
    Album,
    AlbumSkeleton,
    Searchbar,
  },
  data: function() {
    return {
      searchString: '',
    };
  },
  computed: mapState({
    albumsInSearch: state => state.albumsInSearch,
    albumsInList: state => state.albumsInList,
    albumsInListened: state => state.albumsInListened,
    searching: state => state.searching,
  }),
  mounted() {
    this.refreshAlbumsInList();
    this.refreshAlbumsInListened();
    this.refreshAccessToken();
  },
  created() {
    // Attach event listener to html-tag
    window.addEventListener('scroll', this.onScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    updateSearchString(searchString) {
      this.searchString = searchString;
    },
    onScroll({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight },
      },
    }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.nextAlbums();
      }
    },
    ...mapActions([
      'nextAlbums',
      'refreshAlbumsInList',
      'refreshAlbumsInListened',
      'refreshAccessToken',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.album-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 12px;
  justify-items: center;
  width: fit-content;
  margin: auto;
}

.result {
  margin: auto;
  text-align: center;
}
.result-text {
  display: inline-block;
  font-size: 24px;
  color: white;
}

.header {
  text-align: center;
  color: white;
  margin: auto;
  margin-bottom: 2rem;
}

@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
