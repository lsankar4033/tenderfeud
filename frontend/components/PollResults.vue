<template>
  <div>
    {{ poll.question }}
    {{ poll }}
    <div v-for="answer in poll.answer" :key="answer.text">
      <InactivePollListItem :answer="poll.answer" />
    </div>
    {{ userVote }}
  </div>
</template>

<script>
import InactivePollListItem from '~/components/InactivePollListItem'

export default {
  name: 'PollResults',
  props: ['poll'],
  components: {
    InactivePollListItem,
  },
  computed: {
    userVote() {
      const votes = this.$store.state.user.votes
      for (let i = 0; i < votes.length; i++) {
        if (votes[i].id === this.poll.id) {
          return votes[i].answer
        }
      }
      return 'error'
    }
  },
}
</script>

<style>

</style>
