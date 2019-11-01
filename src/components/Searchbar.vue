<template>
  <v-text-field v-model="name" placeholder="placeholder" />
</template>

<script>
export default {
  name: 'Searchbar',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
  },
};
</script>
