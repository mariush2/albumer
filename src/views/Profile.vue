<template>
  <div class="content">
    <div class="header">
      <i class="el-icon-user"></i>
      <h1>Profile</h1>
    </div>
    <div class="username">
      <UsernameInput />
    </div>
    <div class="friends-list">
      <div class="header">
        <i class="el-icon-user"></i>
        <i class="el-icon-user"></i>
        <h2>Friends list</h2>
      </div>
      <p v-if="friendsList.length > 0">
        To recommend an album to someone, you need to have them in your friends list
      </p>
      <p v-else>You don't have any friends yet:(</p>
      <div v-if="friendsList.length > 0" class="grid">
        <Friend v-for="friend in friendsList" :key="friend.name" :user="friend" />
      </div>
    </div>
    <div class="friends-search">
      <h2>
        <i class="el-icon-search" />
        Find more friends
      </h2>
      <FriendSearchbar
        @updated="updateFriendsearch"
        @startedSearch="searching = true"
        @searchDone="searchResult"
      />
      <div class="search-grid">
        <template v-if="searching">
          <FriendSkeleton v-for="index in 4" :key="index" />
        </template>
        <template v-else>
          <FriendSearch
            v-for="friend in friendSearch"
            :key="friend.username"
            :user="friend"
            :in-friends-list="friendsList.some(item => item.uid == friend.uid)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';

import Friend from '../components/Friend.vue';
import FriendSearch from '../components/FriendSearch.vue';
import FriendSearchbar from '../components/FriendSearchbar.vue';
import FriendSkeleton from '../components/FriendSkeleton.vue';
import UsernameInput from '../components/UsernameInput.vue';

export default {
  name: 'Profile',
  components: {
    Friend,
    FriendSearch,
    FriendSearchbar,
    FriendSkeleton,
    UsernameInput,
  },
  data: function() {
    return {
      friendSearch: [],
      searching: false,
    };
  },
  computed: mapState({
    friendsList: state => state.friendsList,
  }),
  mounted: function() {
    const loader = Loading.service({
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.5)',
    });
    this.refreshFriendsList();
    const interval = setInterval(() => {
      if (this.friendsList && this.friendsList.length >= 0) {
        clearInterval(interval);
        loader.close();
      }
    }, 800);
  },
  methods: {
    updateFriendsearch(newList) {
      this.friendSearch = newList;
    },
    searchResult(result) {
      const uid = auth.currentUser.uid;
      this.friendSearch = result.filter(item => item.uid != uid);
      this.searching = false;
    },
    ...mapActions(['refreshFriendsList']),
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
  }

  > .friends-list {
    color: white;
    > .header {
      display: flex;
      align-items: center;

      > i {
        font-size: 28px;
        margin-right: 3px;
        &:first-child {
          margin-right: -9px;
        }
      }
      > h2 {
        margin-bottom: 1rem;
        font-weight: 400;
      }
    }
    > p {
      margin: 0;
    }
    > .grid {
      display: grid;
      margin: 1rem 0 3rem 0;
      grid-template-columns: 1fr;
      max-height: 20rem;
      overflow-y: scroll;
      > p {
        font-weight: 300;
      }
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

@media (min-width: 500px) {
  .content {
    width: 500px;
    margin: auto;
    > .header {
      justify-content: center;
    }
    > .username {
      max-width: 500px;
    }
  }
}
</style>
