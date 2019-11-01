<template>
  <v-content>
    <v-container fluid fill-height>
      <h1>Find your next album</h1>
      <Searchbar placeholder="Find an album..." />
    </v-container>
  </v-content>
</template>

<script>
import Searchbar from '@/components/Searchbar.vue';

export default {
  name: 'Home',
  components: {
    Searchbar,
  },
};
</script>
