<template>
  <div>
    <v-text-field v-model="searchString" :placeholder="placeholder" />
  </div>
</template>

<script>
import { debounce } from 'lodash';
// Debounce helps us keep the API calls to Spotify to a minimum
import { mapActions } from 'vuex';

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
    searchString: debounce(function() {
      this.findAlbums(this.searchString);
    }, 250),
  },
  methods: {
    ...mapActions(['findAlbums']),
  },
};
</script>
