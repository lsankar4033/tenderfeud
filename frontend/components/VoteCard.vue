<template>
  <div>
    <div class="box">
      <template v-if="true">
        <span>#{{ poll.number }}</span>
        <h1>{{ poll.title }}</h1>
        <div class="flex-container">
          <div v-for="option in poll.options" :key="option.text">
            <div class="options">
              <button @click="vote(option)" class="button">{{ option.text }}</button>
              {{ option.votes }}
            </div>
          </div>
        </div>
      </template>
      <progress-bar :startBlock="poll.startBlock" :endBlock="poll.endBlock" />
      <footer>
        <span class="right">
          {{ poll.hash }}
        </span>
      </footer>
    </div>
  </div>
</template>

<script>
import ProgressBar from '~/components/ProgressBar.vue'
export default {
  name: 'VoteCard',
  props: ['poll'],
  components: {
    ProgressBar,
  },
  methods: {
    vote(option) {
      const payload = {
        pollNum: this.poll.number,
        option: option.number, //consider using option index
      }
      this.$store.commit('vote', payload)
    }
  }
}
</script>

<style>
.flex-container {
  display: flex;
  justify-content: space-between;
}
.options {
  display: flex;
  align-items: center;
}
footer {
  display: flex;
}
.right {
  margin-left: auto;
}
</style>

