<template>
  <el-card shadow="never" class="card" body-style="padding: 10px">
    <div class="card-body">
      <i class="el-icon-user" />
      <div class="friend-name">{{ user.username }}</div>
      <el-button
        v-if="inFriendsList"
        class="add-button"
        type="success"
        plain
        icon="el-icon-check"
        disabled
      >
        Added
      </el-button>
      <el-button
        v-else-if="!adding"
        class="add-button"
        type="success"
        plain
        icon="el-icon-plus"
        @click="addFriend"
      >
        Add
      </el-button>
      <el-button v-else class="add-button" type="success" plain icon="el-icon-loading" disabled>
        Adding
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';

const addingDelay = 500;

export default {
  name: 'FriendSearch',
  props: {
    user: {
      type: Object,
      required: true,
    },
    inFriendsList: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
    return {
      adding: false,
    };
  },
  methods: {
    addFriend() {
      this.adding = true;
      setTimeout(async () => {
        await this.addToFriendsList(this.user);
        await this.setFriendsListInDB();
        this.adding = false;
      }, addingDelay);
    },
    ...mapActions(['addToFriendsList', 'setFriendsListInDB']),
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  align-items: center;
  grid-gap: 5px;
}

i {
  font-size: 24px;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  padding: 8px;
  border-radius: 100%;
}

.friend-name {
  overflow-x: hidden;
  position: relative;
}
.friend-name::before {
  position: absolute;
  right: 0;
  top: 0;
  width: 25px;
  height: 100%;
  background: linear-gradient(90deg, transparent, white);
}
</style>
