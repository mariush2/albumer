<template>
  <div>
    <v-text-field
      v-model="searchString"
      :placeholder="placeholder"
      clearable
      flat
      solo
      light
      elevation="0"
      prepend-inner-icon="fa-search"
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
