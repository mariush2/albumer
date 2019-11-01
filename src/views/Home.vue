<template>
  <div class="home">
    <Searchbar placeholder="Find an album..." />
  </div>
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
