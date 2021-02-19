<template>
  <div class="content">
    <h2>{{ user.username }}</h2>
    <h3>({{ formated(user.phone) }})</h3>
  </div>
</template>

<script>
export default {
  name: 'Friend',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formated(phone) {
      const match = phone.match(/(\+\d{2})(\d{3})(\d{2})(\d{3})/);
      return `${match[1]} ${match[2]} ${match[3]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  > h2 {
    margin: 1rem 0;
    margin-right: 1rem;
    font-weight: 400;
  }
  > h3 {
    font-weight: 300;
    margin: 0;
  }
}
</style>
