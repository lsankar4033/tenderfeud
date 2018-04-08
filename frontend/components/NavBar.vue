<template>
  <!-- TODO: Style entire header, have default stuff there -->
  <div>
    <div id="account-balance">
      Balance: {{ accountBalance }} tokens
    </div>

    <div id="block-number">
      Block Number: {{ currentBlock }}
    </div>

    <input id="name-input" v-on:keyup="setUser" v-model="nameInput" placeholder="Enter name...">

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
