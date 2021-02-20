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
import { auth, functionsServer } from '../firebase';

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
        this.findUsers(this.searchString);
      }
    },
  },
  methods: {
    sendSearchResult(result) {
      this.$emit('searchDone', result);
    },
    findUsers: debounce(async function(search) {
      const userId = await auth.currentUser.getIdToken();
      const headers = new Headers({
        method: 'GET',
        Authorization: `Bearer ${userId}`,
        'Access-Control-Allow-Origin': functionsServer,
        'Access-Control-Allow-Credentials': 'true',
      });
      const response = await fetch(
        `${functionsServer}/app/getUsersWithUsername?username=${search}`,
        {
          headers,
        }
      );
      const body = await response.json();
      this.sendSearchResult(body.result);
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
