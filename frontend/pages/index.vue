<template>
  <section class="container">
    <NavBar />
    <NewPoll />
    Active Polls
    <div v-for="activePoll in activePolls" :key="activePoll.question">
      <vote-card :poll="activePoll" />
    </div>
    <br />
    Inactive Polls
    <div v-for="inactivePoll in inactivePolls" :key="inactivePoll.question">
      <vote-card :poll="inactivePoll" />
    </div>
  <template class="extra">
    {{ blockchain }}
    {{ activePolls }}
    {{ inactivePolls }}
    <button @click="$store.commit('increment')">Mine Block</button>
    <button @click="$store.dispatch('getBlockchain')">Axios</button>
  </template>
  </section>
</template>

<script>
import VoteCard from '~/components/VoteCard.vue'
import NavBar from '~/components/NavBar.vue'
import NewPoll from '~/components/NewPoll.vue'
export default {
  components: {
    VoteCard,
    NavBar,
    NewPoll,
  },
  mounted() {
    this.getBlockchain()
  },
  methods: {
    getBlockchain() {
      setTimeout(() => {
        this.$store.dispatch('getBlockchain')
        this.getBlockchain()
      }, 1000)
    }
  },
  computed: {
    blockchain() {
      return this.$store.state.blockChain.blockHeight
    },
    firstPoll() {
      return this.$store.state.polls[0]
    },
    activePolls() {
      let result = []
      for (let i = 0; i < this.$store.state.activePollIds.length; i++) {
        const id = this.$store.state.activePollIds[i]
        result.push(this.$store.state.activePolls[id])
      }
      return result
    },
    inactivePolls() {
      let result = []
      for (let i = 0; i < this.$store.state.inactivePollIds.length; i++) {
        const id = this.$store.state.inactivePollIds[i]
        result.push(this.$store.state.inactivePolls[id])
      }
      return result
    },
  }
}
</script>

<style>
.extra {
  display: flex;
}
</style>
