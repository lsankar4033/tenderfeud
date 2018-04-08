<template>
  <div v-if="createPollVisible">
    <div :class="{modal: true, 'is-active': createPollVisible}">
      <div @click="closeModal" class="modal-background"></div>
      <div class="modal-card">
        <div class="modal-card-head">
          <h1 class="modal-card-title">Create new poll</h1>
        </div>
        <div class="modal-card-body">
          <div v-if="error" class="error">There was an issue creating your poll.</div>
          <div class="field">
            <div class="control">
              <input class="input is-large" v-model="questionString" placeholder="Enter a question">
              <span class="explanation">What question would you like to ask? </span>
            </div>
          </div>
          <div class="level">
            <div class="level-left">
              <input :class="{input: true, 'is-small': true, 'is-danger': userBalance < 1}" min="0" :max="userBalance" v-model="payout" type="number" placeholder="Enter a number">
              <span class="explanation"> How many tokens will be shared by the winners?</span>
              <span v-if="userBalance < 1">Your balance is too low ({{ userBalance }} tokens). To get more tokens, vote on polls!</span>
            </div>
          </div>
          <div class="level">
            <div class="level-left">
              <input class="input is-small" v-model="blockLifetime" min="0" type="number" placeholder="Enter a number">
              <span class="explanation"> How long would you like the poll to last? (blocks)</span>
            </div>
          </div>
        </div>
        <div class="modal-card-foot submit">
          <button @click="create()" class="submit-button button is-info">Create</button>
        </div>
      </div>
      <button @click="closeModal" class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      blockLifetime: null,
      questionString: "",
      payout: null,
      error: false,
    }
  },
  computed: {
    createPollVisible() {
      return this.$store.state.createPollVisible
    },
    userBalance() {
      return this.$store.state.user.balance
    },
  },
  methods: {
    create: function (event) {
      const blockLifetime = parseFloat(this.blockLifetime)
      const payout = parseFloat(this.payout)
      const questionString = this.questionString
      if (blockLifetime > 0 && payout > 0 && payout < this.userBalance && questionString.length > 0) {
        this.$store.dispatch('createNewPoll', {
          blockLifetime,
          questionString,
          payout,
        })
        this.error = false
        this.closeModal()
      } else {
        this.error = true
      }

      // this.closeModal()
    },
    closeModal() {
      this.$store.commit('toggle_create_poll', false)
    },
  }
}
</script>

<style>
.modal-content {
  padding: 20px;
  width: 50%;
  background: white;
}
.submit {
  display: flex;
}
.submit-button {
  margin-left: auto;
}
.level-left {
  display: flex;
  flex-direction: column;
}
.explanation {
  font-size: 8pt;
  font-weight: 600;
  margin-right: auto;
}
.error {
  color: red;
}
</style>

