<template>
  <section class="container">
    <NavBar />
    <NewPoll />
    <div v-for="activePoll in activePolls" :key="activePoll.question">
      <div class="box green">
        <vote-card :poll="activePoll" />
      </div>
    </div>
    <br />
    <div v-for="inactivePoll in inactivePolls" :key="inactivePoll.question">
      <div class="box red">
        <vote-card :poll="inactivePoll" />
      </div>
    </div>
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
.container {
  padding: 10px 20px;
}
.box {
  background: white;
}
.green {
  border: 1px solid green;
}
.red {
  border: 1px solid red;
}
</style>
