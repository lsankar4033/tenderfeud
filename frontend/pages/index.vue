<template>
  <section class="container">
    <vote-card :poll="firstPoll" />
  <template>
    <button @click="$store.commit('increment')">Mine Block</button>
  </template>
  </section>
</template>

<script>
import VoteCard from '~/components/VoteCard.vue'
export default {
  components: {
    VoteCard,
  },
  data() {
    return {
      
    }
  },
  computed: {
    firstPoll() {
      return this.$store.state.polls[0]
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
