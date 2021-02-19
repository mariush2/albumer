<template>
  <el-card shadow="never" class="card">
    <div class="card-body">
      <div class="album-image"></div>
      <div class="album-content">
        <div class="album-artist"></div>
        <div class="album-info"></div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
$grey: rgba(0, 0, 0, 0.2);
.card-body {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.card {
  max-width: 500px;
  width: 100%;
}

.album-image,
.album-artist,
.album-info {
  background: linear-gradient(90deg, $grey, lighten($grey, 35%), $grey);
  background-size: 400% 400%;
  animation: gradient 2s ease infinite;
}
.album-image {
  width: 80px;
  height: 80px;
  margin-right: 1rem;
}
.album-artist {
  width: 100%;
  min-height: 1.25rem;
  margin-bottom: 10px;
}
.album-info {
  width: 100%;
  min-height: 12px;
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
