<template>
  <div>
    <div class="card">
      <template v-if="status !== 'loading'">
        <span>${{ poll.payout }}</span>
        <h1 class="card-header">{{ poll.question }}</h1>
        <div :class="{flexcontainer: poll.active && !userVote}">
          <div v-for="answer in answers" :key="answer.text">
            <div class="options">
              <div class="active-item" v-if="poll.active && !userVote">
                <ActivePollListItem :answer="answer" :vote="vote" />
                <!-- <div v-if="idx === answers.length -1">hi</div> -->
              </div>
              <div v-if="!poll.active || userVote">
                <InactivePollListItem :answer="answer" :highlight="userVote" />
              </div>
            </div>
          </div>
          <div v-if="poll.active && !userVote" class="new-answer">
            <input class="input is-primary" v-model="newAnswer"/>
            <button class="button is-small" @click="vote({text: newAnswer})">New Answer</button>
          </div>
          <div v-if="userVote">
            You voted for {{ userVote }}
          </div>
        </div>
      </template>
      <template v-if="status==='loading'">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </template>
      <div class="card-footer">
        <progress-bar :startBlock="poll.startBlock" :endBlock="poll.endBlock" />
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '~/components/ProgressBar.vue'
import utils from '~/front_utils'
import ActivePollListItem from '~/components/ActivePollListItem.vue'
import InactivePollListItem from '~/components/InactivePollListItem.vue'
import PollResults from '~/components/PollResults.vue'

export default {
  name: 'VoteCard',
  props: ['poll'],
  components: {
    ProgressBar,
    ActivePollListItem,
    InactivePollListItem,
    PollResults,
  },
  data() {
    return {
      status: 'getInput',
      newAnswer: '',
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
    },
    userVote() {
      const votes = this.$store.state.user.votes
      for (let i = 0; i < votes.length; i++) {
        if (votes[i].id === this.poll.id) {
          return votes[i].answer
        }
      }
      return false
    },
    voteReceived() {
      const options = Object.keys(this.poll.answers)
      const userAddress = this.$store.state.user.address
      for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < this.poll.answers[options[i]].length; j++) {
          if (this.poll.answers[options[i]][j] === userAddress) {
            return true
          }
        }
      }
      return false
    },
  },
  methods: {
    vote(option) {
      // if (!option) option = {
      //   text: this.newAnswer
      // }
      const payload = {
        pollId: this.poll.id,
        answer: option.text || this.newAnswer, //consider using option index
      }
      this.status = 'loading'
      this.$store.dispatch('voteOnBlockchain', payload)
      setTimeout(() => {
        // change this to input received
        this.status = 'getInput'
      }, 2000)
    }
  },
}
</script>

<style>
.flexcontainer {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
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
.new-answer {
  display: flex;
  flex-direction: column;
}


h1.card-header {
  display: inherit;
  text-align: center;
  padding: 5px 0 20px 0;
  font-size: 16pt;
}

.active-item {
  padding: 16px;
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

