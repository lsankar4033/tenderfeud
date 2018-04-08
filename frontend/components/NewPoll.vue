<template>
  <div>
    <br><br>
    <h1>Create new poll</h1>
    <input v-model="questionString" placeholder="question">
    <br>
    <input v-model="payout" placeholder="payout">
    <br>
    <input v-model="blockLifetime" placeholder="block lifetime">
    <br>
    <button @click="create()" class="button">GO</button>
    <br><br>
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
    }
  },
  methods: {
    create: function (event) {
      this.$store.dispatch('createNewPoll', {
        blockLifetime: 1000,
        questionString: "dummy question",
        payout: 0,
      })
    }
  }
}
</script>

<style>

</style>

