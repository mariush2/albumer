<template>
  <el-card shadow="never" class="card" body-style="padding: 10px">
    <div class="card-body">
      <i class="el-icon-user" />
      <div class="friend-name">{{ user.username }}</div>
      <el-button
        v-if="!removing"
        class="remove-button"
        type="text"
        circle
        icon="el-icon-delete"
        @click="removeFriend"
      />
      <el-button v-else class="remove-button" type="text" circle icon="el-icon-loading" disabled />
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';

const removeDelay = 500;

export default {
  name: 'Friend',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      removing: false,
    };
  },
  methods: {
    removeFriend() {
      this.removing = true;
      setTimeout(async () => {
        await this.removeFromFriendsList(this.user.uid);
        await this.setFriendsListInDB();
        this.removing = false;
      }, removeDelay);
    },
    ...mapActions(['removeFromFriendsList', 'setFriendsListInDB']),
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 0;

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
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

.remove-button {
  width: fit-content;
  justify-self: end;
}

.friend-name {
  overflow-x: hidden;
  position: relative;
}
.friend-name::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 25px;
  height: 100%;
  background: linear-gradient(to right, rgba(239, 241, 243, 0), #eff1f3);
}
</style>
