<template>
  <div>
    <div class="header">
      <h1>Find your next album</h1>
      <Album-searchbar placeholder="Find an album..." @search="updateSearchString" />
    </div>
    <div>
      <template v-if="searching">
        <div class="album-grid">
          <div>
            <template v-for="index in 8">
              <Album-skeleton :key="index" />
            </template>
          </div>
        </div>
      </template>
      <template v-else-if="albumsInSearch[0] != 'none'">
        <div class="album-grid">
          <transition-group
            name="stagger"
            tag="div"
            :css="false"
            appear
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <template v-for="(album, index) in albumsInSearch">
              <Album
                :key="`album-${index}`"
                class="albums-item"
                :data-index="index"
                :album="album"
              />
            </template>
          </transition-group>
        </div>
      </template>
      <template v-else-if="searchString.length > 0">
        <div class="result">
          <h1 class="result-text">Couldn't find any albums</h1>
        </div>
      </template>
    </div>
    <div v-if="foundAll" class="end">
      <p>You've reached the end...</p>
      <img src="@/assets/vinyl.png" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Velocity from 'velocity-animate';

import Album from '@/components/Album.vue';
import AlbumSkeleton from '@/components/AlbumSkeleton.vue';
import AlbumSearchbar from '@/components/AlbumSearchbar.vue';

export default {
  name: 'FindAlbums',
  components: {
    Album,
    AlbumSkeleton,
    AlbumSearchbar,
  },
  data: function() {
    return {
      searchString: '',
      renderedHits: 0,
    };
  },
  computed: mapState({
    foundAll: state => state.foundAll,
    albumsInSearch: state => state.albumsInSearch,
    albumsInList: state => state.albumsInList,
    albumsInListened: state => state.albumsInListened,
    searching: state => state.searching,
  }),
  mounted() {
    this.refreshAlbumsInList();
    this.refreshAlbumsInListened();
    this.refreshFriendsList();
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
    beforeEnter: function(el) {
      el.style.transform = 'translateX(200%)';
    },
    enter: async function(el, done) {
      let delay = (el.dataset.index - this.renderedHits) * 150;
      let vm = this;
      setTimeout(function() {
        Velocity(el, { transform: 'translateX(0)' }, { duration: 500, complete: done });
        vm.renderedHits += 1;
      }, delay);
    },
    updateSearchString(searchString) {
      this.searchString = searchString;
      this.renderedHits = 0;
    },
    onScroll({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight },
      },
    }) {
      if (scrollTop + clientHeight >= scrollHeight - 250) {
        this.nextAlbums();
      }
    },
    ...mapActions([
      'nextAlbums',
      'refreshAlbumsInList',
      'refreshAlbumsInListened',
      'refreshAccessToken',
      'refreshFriendsList',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.album-grid > div {
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 12px;
  padding-top: 1rem;
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
  color: #eff1f3;
}

.header {
  text-align: center;
  color: #eff1f3;
  margin: auto;
}

.end {
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
  color: #eff1f3;
  margin-bottom: 1rem;
  > p {
    margin-bottom: 1rem;
    font-size: 22px;
  }
  > img {
    width: 180px;
    /* 1.79s because 33.5 rpm in a vinyl */
    animation: rotate 1.79s infinite linear;
  }
}

@media (max-width: 420px) {
  .header {
    text-align: left;
  }
}
@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
