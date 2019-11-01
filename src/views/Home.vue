<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <Searchbar placeholder="Find an album..." />
      </v-layout>
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
