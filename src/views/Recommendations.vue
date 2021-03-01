<template>
  <div class="content">
    <div class="header">
      <h1 ref="title">
        <i class="el-icon-receiving" />
        Recommendations
      </h1>
      <el-select
        ref="sorting"
        v-model="sorting"
        class="select"
        placeholder="Sorting"
        @change="changeSorting"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div v-if="albums.length > 0" class="album-grid">
      <transition-group name="albums" tag="div" appear>
        <album-recommendation
          v-for="album in albums"
          :key="`${index}-${album.id}`"
          :album="album"
          @updated="update"
        />
      </transition-group>
    </div>
    <div v-else class="no-albums">
      <p>
        You don't have any albums in your
        <br />
        recommendations at the moment.
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';
import AlbumRecommendation from '../components/AlbumRecommendation.vue';
export default {
  name: 'Listened',
  components: { AlbumRecommendation },
  data: function() {
    return {
      albums: [],
      options: [
        {
          value: 'title',
          label: 'Title',
        },
        {
          value: 'artist',
          label: 'Artist',
        },
        {
          value: 'year_asc',
          label: 'Oldest - released',
        },
        {
          value: 'year_des',
          label: 'Newest - released',
        },
        {
          value: 'added_asc',
          label: 'Oldest - recommendation',
        },
        {
          value: 'added_des',
          label: 'Newest - recommendation',
        },
      ],
      sorting: 'added_des',
      loading: true,
    };
  },
  computed: mapState({
    recommendations: state => state.recommendations,
  }),
  async mounted() {
    const loader = Loading.service({
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.5)',
    });
    await this.refreshRecommendations();
    const interval = setInterval(() => {
      if (this.recommendations && this.recommendations.length >= 0) {
        clearInterval(interval);
        this.albums = this.recommendations;
        this.changeSorting();
        loader.close();
      }
    }, 800);
  },
  methods: {
    async update() {
      await this.refreshRecommendations();
      this.albums = this.recommendations;
      this.changeSorting();
    },
    changeSorting() {
      switch (this.sorting) {
        case 'title':
          this.albums.sort((a, b) => {
            if (a.name < b.name) return -1;
            return a.name > b.name ? 1 : 0;
          });
          break;
        case 'artist':
          this.albums.sort((a, b) => {
            if (a.artists[0].name < b.artists[0].name) return -1;
            return a.artists[0].name > b.artists[0].name ? 1 : 0;
          });
          break;
        case 'year_asc':
          this.albums.sort((a, b) => {
            if (a.release_date.substring(0, 4) < b.release_date.substring(0, 4)) return -1;
            return a.release_date.substring(0, 4) > b.release_date.substring(0, 4) ? 1 : 0;
          });
          break;
        case 'year_des':
          this.albums.sort((a, b) => {
            if (a.release_date.substring(0, 4) > b.release_date.substring(0, 4)) return -1;
            return a.release_date.substring(0, 4) < b.release_date.substring(0, 4) ? 1 : 0;
          });
          break;
        case 'added_asc':
          this.albums.sort((a, b) => {
            if (new Date(a.added_date) < new Date(b.added_date)) return -1;
            return new Date(a.added_date) > new Date(b.added_date) ? 1 : 0;
          });
          break;
        case 'added_des':
          this.albums.sort((a, b) => {
            if (new Date(a.added_date) > new Date(b.added_date)) return -1;
            return new Date(a.added_date) < new Date(b.added_date) ? 1 : 0;
          });
          break;
      }
    },
    ...mapActions(['refreshRecommendations']),
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-gap: 15px;

  > h1 {
    text-align: left;
    color: white;
    font-size: 150%;
  }
}

.album-grid > div {
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 1rem;
  grid-gap: 15px;
  width: fit-content;
  justify-items: center;
  margin: auto;
}

.select {
  background: none;
}

.no-albums {
  margin-top: 2rem;
  > p {
    color: white;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    > .link {
      font-size: 20px;
    }
  }
}

@media (max-width: 700px) {
  .header > h1 {
    margin-bottom: 0;
  }
}
@media (min-width: 700px) {
  .header {
    > * {
      grid-row: 1;
    }
    > h1 {
      text-align: center;
    }
  }
}
@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.albums-item {
  display: inline-block;
  transition: all 1s;
}
.albums-move {
  transition: transform 1s;
}
.albums-enter {
  transform: translateX(100%);
}
.albums-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.albums-leave-active {
  position: absolute;
  transition: all 1s;
}
</style>
