<template>
  <!-- TODO: Style entire header, have default stuff there -->
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
</template>

<script>
import utils from '~/front_utils'
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
    }
  }
}
</script>

<style>

</style>
