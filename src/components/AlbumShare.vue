<template>
  <div>
    <div class="card-body">
      <el-button
        class="back-button"
        plain
        circle
        type="text"
        size="small"
        icon="el-icon-arrow-left"
        @click="close"
      />
      <div class="header">
        <h2>Send recommendation</h2>
      </div>
      <div class="album">
        <div class="album-image">
          <el-image fit="fill" :src="album.images[0].url" />
        </div>
        <div class="album-text">
          <div class="album-title">
            <p>{{ album.name }}</p>
          </div>
          <div class="album-artist">
            <p>by {{ album.artists[0].name }}</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <el-select
          v-model="selectedFriend"
          filterable
          placeholder="Choose friend"
          no-data-text="Add friends on the Profile page"
        >
          <el-option
            v-for="friend in friendsList"
            :key="friend.username"
            :label="friend.username"
            :value="friend.uid"
          ></el-option>
        </el-select>
        <el-button
          v-if="selectedFriend != null && !sending"
          class="send-button"
          plain
          @click="sendRecommendation"
        >
          Send
        </el-button>
        <el-button
          v-else-if="sending"
          class="send-button"
          plain
          type="success"
          disabled
          icon="el-icon-loading"
        >
          Sending
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { auth, functionsServer } from '../firebase';

export default {
  name: 'AlbumShare',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      selectedFriend: null,
      sending: false,
    };
  },
  computed: mapState({
    friendsList: state => state.friendsList,
  }),
  methods: {
    async sendRecommendation() {
      this.sending = true;
      const uid = this.selectedFriend;
      const userId = await auth.currentUser.getIdToken();
      const currentUser = await auth.currentUser.displayName;
      const headers = new Headers({
        Authorization: `Bearer ${userId}`,
        'Access-Control-Allow-Origin': functionsServer,
        'Access-Control-Allow-Credentials': 'true',
      });
      const response = await fetch(`${functionsServer}/app/sendRecommendation`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          recipient: uid,
          recommendation: { ...this.album, sender: currentUser, added_date: new Date().toJSON() },
        }),
      });
      const status = response.status;
      this.sending = false;
      const friendName = this.friendsList.filter(friend => friend.uid === uid)[0].username;
      if (status == 200) {
        // Worked
        this.$message({
          message: 'Sent recommendation',
          type: 'success',
        });
        this.$emit('close');
      } else if (status == 302) {
        this.$message({
          message: `${friendName} already has album in recommendations`,
          type: 'warning',
        });
      } else if (status == 303) {
        this.$message({
          message: `${friendName} has already listened to that album`,
          type: 'info',
        });
      } else if (status == 304) {
        this.$message({
          message: `${friendName} already has album in their list`,
          type: 'info',
        });
      } else {
        // Did not work
        this.$message.error('Oops. Something went wrong.');
      }
    },
    close() {
      this.selectedFriend = null;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr;
  position: relative;
  justify-content: center;
  justify-items: center;
  width: 320px;
  grid-gap: 10px;
}

.header {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  > h2 {
    margin: 5px 0 10px 0;
  }
}

.album {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  width: fit-content;
  justify-items: center;
  align-items: center;
  margin-bottom: 10px;
}
.album-content {
  display: grid;
  grid-gap: 15px;
}
.album-image {
  width: 100px;
  height: 100px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
}

.album-title > p {
  font-weight: 500;
  padding-right: 28px;
  margin: 0;
  margin-bottom: 5px;
}
.album-artist > p {
  font-weight: 400;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: center;
  height: fit-content;
  gap: 5px;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  color: #241715;
}

@media (min-width: 516px) {
  .card-body {
    width: 440px;
  }
}

@media (max-width: 515px) {
  .card-body {
    width: 400px;
  }
  .album {
    grid-template-columns: 1fr 1fr;
  }
  .album-image {
    justify-self: flex-end;
  }
}
@media (max-width: 465px) {
  .card-body {
    width: 380px;
  }
  .header > h2 {
    font-size: 20px;
  }
}

@media (max-width: 440px) {
  .card-body {
    width: 350px;
  }
}
@media (max-width: 405px) {
  .card-body {
    width: 320px;
  }
}
</style>
