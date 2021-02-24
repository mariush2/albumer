<template>
  <el-card shadow="never" class="card">
    <div class="card-content">
      <transition name="slide-in">
        <component
          :is="currentComponent"
          v-if="!isSharing"
          :album="album"
          @share="isSharing = true"
          @deleted="passDeleted"
        />
      </transition>
      <transition name="slide-out">
        <album-share v-if="isSharing" :album="album" @close="isSharing = false" />
      </transition>
    </div>
  </el-card>
</template>

<script>
import AlbumShare from './AlbumShare.vue';
import AlbumSearch from './AlbumSearch.vue';
import AlbumList from './AlbumList.vue';
import AlbumListened from './AlbumListened.vue';
import AlbumRecommendation from './AlbumRecommendation.vue';

export default {
  name: 'Album',
  components: {
    AlbumSearch,
    AlbumShare,
  },
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      isSharing: false,
    };
  },
  computed: {
    currentComponent() {
      let component;
      switch (this.$router.history.current.path) {
        case '/':
          component = AlbumSearch;
          break;
        case '/list':
          component = AlbumList;
          break;
        case '/listened':
          component = AlbumListened;
          break;
        case '/recommendations':
          component = AlbumRecommendation;
          break;
      }
      return component;
    },
  },
  methods: {
    passDeleted(albumId) {
      this.$emit('deleted', albumId);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 0;
  overflow: hidden;
}

.card-content {
  display: flex;
  flex-direction: row;
  position: relative;
}

.slide-in-enter,
.slide-in-enter-to,
.slide-in-leave-to,
.slide-out-enter,
.slide-out-enter-to,
.slide-out-leave,
.slide-out-leave-to {
  transition: transform 0.5s;
}

.slide-in-enter {
  transform: translateX(-125%);
}
.slide-in-enter-to {
  transform: translateX(0);
}
.slide-in-leave-to {
  transform: translateX(-125%);
  position: relative;
}

.slide-out-enter {
  transform: translateX(0);
}
.slide-out-enter-to {
  transform: translateX(-100%);
}
.slide-out-leave {
  transform: translateX(-125%);
}
.slide-out-leave-to {
  transform: translateX(125%);
  position: absolute;
}

@media (min-width: 516px) {
  .card {
    max-width: 480px;
  }
}

@media (max-width: 515px) {
  .card {
    max-width: 440px;
  }
}
@media (max-width: 465px) {
  .card {
    max-width: 420px;
  }
}

@media (max-width: 440px) {
  .card {
    max-width: 390px;
  }
}
@media (max-width: 405px) {
  .card {
    max-width: 360px;
  }
}
</style>
