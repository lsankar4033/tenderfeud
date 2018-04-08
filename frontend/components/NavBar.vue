<template>
  <div>
    <div class="columns">
      <div id="account-balance" class="column">
        Balance: {{ accountBalance }} tokens
      </div>

      <div id="block-number" class="column">
        Block Number: {{ currentBlock }}
      </div>

      <div class="column">
        <input id="name-input" v-on:keyup="setUser" v-model="nameInput" placeholder="Enter name...">
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
}
</style>
