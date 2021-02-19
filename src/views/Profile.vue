<template>
  <div class="content">
    <div class="header">
      <i class="el-icon-user"></i>
      <h1>Profile</h1>
    </div>
    <div class="username">
      <h2>Your current username</h2>
      <el-input v-model="username" />
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
          <FriendSkeleton v-for="index in 4" :key="index" />
        </template>
        <template v-else>
          <h1>Result</h1>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Friend from '../components/Friend.vue';
import FriendSearchbar from '../components/FriendSearchbar.vue';
import FriendSkeleton from '../components/FriendSkeleton.vue';

export default {
  components: {
    Friend,
    FriendSearchbar,
    FriendSkeleton,
  },
  name: 'Profile',
  data: function() {
    return {
      username: 'blablabal',
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
  methods: {
    updateFriendsearch(newList) {
      this.friendSearch = newList;
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
</style>
