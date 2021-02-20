<template>
  <el-card shadow="never" body-style="padding: 15px">
    <div class="card-body">
      <div class="friend-icon"></div>
      <div class="friend-content">
        <div class="friend-name"></div>
        <div class="friend-info"></div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
$grey: rgba(0, 0, 0, 0.2);
.card-body {
  display: grid;
  grid-template-columns: auto 3fr;
  grid-gap: 15px;
}

.friend-icon,
.friend-name {
  background: linear-gradient(90deg, $grey, lighten($grey, 35%), $grey);
  background-size: 400% 400%;
  animation: gradient 2s ease infinite;
}
.friend-icon {
  height: 30px;
  width: 30px;
}
.friend-name {
  width: 100%;
  height: 100%;
  min-height: 1.25rem;
  margin-bottom: 10px;
}

@keyframes gradient {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 135% 100%;
  }
}
</style>
