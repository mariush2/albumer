<template>
  <div class="content">
    <div class="header">
      <i class="el-icon-user"></i>
      <h1>Profile</h1>
    </div>
    <div class="username">
      <template v-if="savedUsername != null">
        <h2>Your current username</h2>
        <el-input v-model="username">
          <el-button
            v-if="username != savedUsername"
            slot="append"
            icon="el-icon-check"
            type="success"
            class="save-button"
            @click="updateUsername"
          >
            Save
          </el-button>
        </el-input>
      </template>
      <template v-else>
        <h2>You haven’t yet created a username,</h2>
        <el-input v-model="username" placeholder="Enter a username">
          <el-button
            v-if="username != savedUsername"
            slot="append"
            icon="el-icon-check"
            type="success"
            class="save-button"
            @click="updateUsername"
          >
            Save
          </el-button>
        </el-input>
      </template>
    </div>
    <div class="friends-list">
      <div class="header">
        <i class="el-icon-user"></i>
        <i class="el-icon-user"></i>
        <h2>Friends list</h2>
      </div>
      <p>To recommend an album to someone, you need to have them in your friends list</p>
      <div class="content">
        <Friend v-for="friend in friendslist" :key="friend.phone" :user="friend" />
      </div>
    </div>
    <div class="friends-search">
      <h2>Find more friends</h2>
      <FriendSearchbar @updated="updateFriendsearch" @startedSearch="searching = true" />
      <div class="search-grid">
        <template v-if="searching">
          <FriendSkeleton v-for="index in 2" :key="index" />
        </template>
        <template v-else>
          <h1>Result</h1>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';

import Friend from '../components/Friend.vue';
import FriendSearchbar from '../components/FriendSearchbar.vue';
import FriendSkeleton from '../components/FriendSkeleton.vue';

export default {
  name: 'Profile',
  components: {
    Friend,
    FriendSearchbar,
    FriendSkeleton,
  },
  data: function() {
    return {
      username: null,
      savedUsername: null,
      friendslist: [
        {
          username: 'Tor',
          phone: '+4712345678',
        },
        {
          username: 'Gudfinn',
          phone: '+4712345688',
        },
      ],
      friendSearch: [],
      searching: false,
    };
  },
  mounted: function() {
    // Get current username from firebase
    const user = auth.currentUser;
    this.savedUsername = user.displayName;
    this.username = this.savedUsername;
  },
  methods: {
    updateFriendsearch(newList) {
      this.friendSearch = newList;
    },
    async updateUsername() {
      const user = auth.currentUser;

      user
        .updateProfile({
          displayName: this.username,
        })
        .then(() => {
          // Update successful.
          this.$message({
            message: 'Updated username.',
            type: 'success',
          });
          this.savedUsername = this.username;
        })
        .catch(error => {
          // An error happened.
          this.$message.error('Error occured when trying to update username');
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  > .header {
    display: flex;
    align-items: center;
    margin-top: 4rem;
    color: white;

    > i {
      font-size: 32px;
    }

    > h1 {
      font-weight: 400;
    }
  }

  > .username {
    margin-bottom: 2rem;
    > h2 {
      color: white;
      margin: 0.5rem 0;
      font-weight: 400;
    }
  }

  > .friends-list {
    color: white;
    > .header {
      display: flex;
      align-items: center;

      > i {
        font-size: 28px;
        &:first-child {
          margin-right: -9px;
        }
      }
      > h2 {
        margin-bottom: 1rem;
      }
    }
    > p {
      margin: 0;
    }
    > .content {
      padding: 1rem 0;
    }
  }

  > .friends-search {
    > h2 {
      color: white;
      font-weight: 400;
    }
    > .search-grid {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 10px;
      margin-top: 10px;
    }
  }
}
.save-button {
  color: #48e06e !important;
}
</style>
