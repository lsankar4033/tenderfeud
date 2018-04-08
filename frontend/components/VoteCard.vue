<template>
  <div>
    <div class="box">
      <template v-if="status === 'getInput'">
        <span>${{ poll.payout }}</span>
        <h1>{{ poll.question }}</h1>
        <div class="flex-container">
          <div v-for="answer in answers" :key="answer.text">
            <div class="options">
              <div v-if="poll.active">
                <ActivePollListItem :answer="answer" :vote="vote" />
              </div>
              <div v-if="!poll.active">
                <InactivePollListItem :answer="answer" />
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
        hi
        <!-- You voted {{ this.poll.options[this.poll.userVote].text }} -->
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
import ActivePollListItem from '~/components/ActivePollListItem.vue'
import InactivePollListItem from '~/components/InactivePollListItem.vue'
export default {
  name: 'VoteCard',
  props: ['poll'],
  components: {
    ProgressBar,
    ActivePollListItem,
    InactivePollListItem,
  },
  data() {
    return {
      status: 'getInput',
    }
  },
  computed: {
    answers() {
      let result = []
      const options = Object.keys(this.poll.answers)
      for(let i = 0; i < options.length; i++) {
        result.push({
          text: options[i],
          votes: this.poll.answers[options[i]].length
        })
      }
      return result
    }
  },
  methods: {
    vote(option) {
      console.log(option)
      const payload = {
        pollId: this.poll.id,
        answer: option.text, //consider using option index
      }
      this.status = 'loading'
      this.$store.dispatch('voteOnBlockchain', payload)
      setTimeout(() => {
        // change this to input received
        this.status = 'getInput'
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
  padding: 2px 5px;
  border-radius: 50%;
  transform: translate(-14px, -28px)
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

