<template>
  <div>
    <div class="box">
      <template v-if="status === 'getInput'">
        <span>#{{ poll.number }}</span>
        <h1>{{ poll.title }}</h1>
        <div class="flex-container">
          <div v-for="option in poll.options" :key="option.text">
            <div class="options">
              <button @click="vote(option)" class="button">{{ option.text }}</button>
              <div class="vote-container">
                <span class="num-votes">{{ option.votes }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="status==='loading'">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </template>
      <template v-if="status==='inputReceived'">
        You voted {{ this.poll.options[this.poll.userVote].text }}
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
  data() {
    return {
      status: 'getInput',
    }
  },
  computed: {
    pollStatus() {
      return this.poll.status
    }
  },
  methods: {
    vote(option) {
      const payload = {
        pollNum: this.poll.number,
        option: option.number, //consider using option index
      }
      this.status = 'loading'
      this.$store.commit('vote', payload)
      setTimeout(() => {
        this.status = 'inputReceived'
      }, 2000)
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
/* .num-container {
  background: red;
  width: 15px;
  height: 15px;
  border-radius: 25px;
} */
.num-votes {
  position: absolute;
  color: white;
  background: red;
  padding: 2px;
  border-radius: 15px;
  transform: translate(-14px, -20px)
}
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 10px auto;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>

