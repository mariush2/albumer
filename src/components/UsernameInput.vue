<template>
  <div>
    <template v-if="savedUsername != null">
      <h2>Your current username</h2>
      <el-input v-model="username" class="username">
        <el-button
          v-if="username != savedUsername && !loading"
          slot="append"
          icon="el-icon-check"
          type="success"
          class="save-button"
          @click="updateUsername"
        >
          Save
        </el-button>
        <el-button
          v-else-if="loading"
          slot="append"
          icon="el-icon-loading"
          type="success"
          class="save-button"
          disabled
        >
          Saving
        </el-button>
      </el-input>
    </template>
    <template v-else>
      <h2>You haven’t yet created a username,</h2>
      <el-input v-model="username" placeholder="Enter a username">
        <el-button
          v-if="username != savedUsername && !loading"
          slot="append"
          icon="el-icon-check"
          type="success"
          class="save-button"
          @click="updateUsername"
        >
          Save
        </el-button>
        <el-button
          v-else-if="loading"
          slot="append"
          icon="el-icon-loading"
          type="success"
          class="save-button"
          disabled
        >
          Saving
        </el-button>
      </el-input>
    </template>
  </div>
</template>

<script>
import { auth, functionsServer } from '../firebase';

const updateDelay = 500;

export default {
  name: 'UsernameInput',
  data: function() {
    return {
      savedUsername: '',
      username: '',
      loading: false,
    };
  },
  mounted: function() {
    // Get current username from firebase
    const user = auth.currentUser;
    this.savedUsername = user.displayName;
    this.username = this.savedUsername;
  },
  methods: {
    async updateUsername() {
      this.loading = true;
      setTimeout(async () => {
        const uid = auth.currentUser.uid;
        const userId = await auth.currentUser.getIdToken();
        const headers = new Headers({
          Authorization: `Bearer ${userId}`,
          'Access-Control-Allow-Origin': functionsServer,
          'Access-Control-Allow-Credentials': 'true',
        });
        const response = await fetch(`${functionsServer}/app/setUsername`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ uid: uid, username: this.username }),
        });
        const status = await response.status;
        this.loading = false;
        if (status == 200) {
          // Worked
          this.$message({
            message: 'Saved username.',
            type: 'success',
          });
          this.savedUsername = this.username;
        } else {
          // Did not work
          this.$message.error('Username is not available, try another one');
        }
      }, updateDelay);
    },
  },
};
</script>

<style lang="scss" scoped>
.save-button {
  color: #48e06e !important;
}
h2 {
  color: white;
  margin: 0.5rem 0;
  font-weight: 400;
}
.username {
}
</style>
