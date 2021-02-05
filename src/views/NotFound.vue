<template>
  <div class="content-container">
    <h1>Oops.</h1>
    <p>Unfortunatly, we couldn't find the page you were looking for.</p>
    <el-link class="link" type="warning" @click="$router.push('/')">
      Go back to the homepage
    </el-link>
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  display: block;
  text-align: center;
  color: white;

  > h1 {
    font-size: 84px;
    margin: 0;
  }

  > p {
    font-size: 18px;
    margin-bottom: 4rem;
  }

  > .link {
    font-size: 20px;
  }
}
</style>
