<template>
  <v-content>
    <v-container fill-height fluid>
      <v-row class="content-container" justify="center">
        <h1>Oops.</h1>
        <p>Unfortunatly, we couldn't find the page you were looking for.</p>
        <v-btn rounded large to="/">Go back to the homepage</v-btn>
      </v-row>
    </v-container>
  </v-content>
</template>

<style lang="scss" scoped>
.content-container {
  display: block;
  text-align: center;

  > h1 {
    font-size: 84px;
  }

  > p {
    padding-bottom: 25px;
    font-size: 18px;
  }
}
</style>
