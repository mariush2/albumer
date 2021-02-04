<template>
  <div class="search-input-div">
    <el-input
      v-model="searchString"
      :placeholder="placeholder"
      size="large"
      clearable
      autofocus
      prefix-icon="el-icon-search"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash';
// Debounce helps us keep the API calls to Spotify to a minimum
import { mapActions } from 'vuex';

// Search delay in ms
const searchDelay = 1500;

export default {
  name: 'Searchbar',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      searchString: '',
    };
  },
  watch: {
    searchString: function() {
      if (this.searchString && this.searchString.length > 0) {
        this.startSearching();
        this.setEmptyAlbums();
        this.callAPI();
      }
      this.$emit('search', this.searchString);
    },
  },
  methods: {
    callAPI: debounce(function() {
      this.findAlbums(this.searchString);
    }, searchDelay),
    ...mapActions(['findAlbums', 'startSearching', 'setEmptyAlbums']),
  },
};
</script>

<style scoped>
.search-input-div {
  max-width: 500px;
  margin: auto;
}
</style>
