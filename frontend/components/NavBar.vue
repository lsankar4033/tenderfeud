<template>
  <div>
    <div class="columns">
      <div id="block-number" class="box column block-num-container">
        <div class="block-num">
          <span class="boldtext">{{ currentBlock }}</span>
          <span>Block Number</span>
        </div>
      </div>

      <div class="column">
        <input class="input is-success" id="name-input" v-on:keyup="setUser" v-model="nameInput" placeholder="Enter name...">
        <div id="account-balance">
          <span class="boldtext">{{ accountBalance }}</span> tokens
        </div>
      </div>

    </div>

    <a v-on:click="setCreatePoll" class="button is-info" id="new-poll-button">
      Create New Poll
    </a>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      nameInput: ""
    }
  },
  computed: {
    currentBlock() {
      return this.$store.state.blockChain.blockHeight
    },
    accountBalance() {
      let address = this.$store.state.user.address
      const balance = this.$store.state.balances[address]

      return balance || 0
    }
  },
  methods: {
    setUser() {
      this.$store.commit('set_user', this.nameInput)
    },
    setCreatePoll() {
      this.$store.commit('toggle_create_poll', true)
    }
  }
}
</script>

<style>
#new-poll-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
}
#account-balance {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;

}
.block-num {
  /* text-align: center;
  margin: 0 auto; */
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
}
.block-num-container {
  display: flex;
  align-items: center;
}
.boldtext {
  font-weight: 600;
  font-size: 14pt;
}
</style>
