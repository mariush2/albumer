<template>
  <div class="search-input-div">
    <el-input
      v-model="searchString"
      placeholder="Find friends"
      clearable
      autofocus
      prefix-icon="el-icon-search"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash';

// Search delay in ms
const searchDelay = 1500;

export default {
  name: 'Searchbar',
  data: function() {
    return {
      searchString: '',
    };
  },
  watch: {
    searchString: function() {
      if (this.searchString && this.searchString.length > 0) {
        this.$emit('startedSearch');
        this.findUsers();
      }
    },
  },
  methods: {
    findUsers: debounce(function() {
      console.log('started search');
    }, searchDelay),
  },
};
</script>

<style lang="scss" scoped>
.search-input-div {
  max-width: 500px;
  margin: auto;
}
</style>
