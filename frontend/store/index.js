import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      currentBlock: 4,
      blocks: [
        {
          number: 1,
          transactions: [],
        },
        {
          number: 2,
          transactions: [],
        },
        {
          number: 3,
          transactions: [],
        },
        {
          number: 4,
          transactions: [],
        }
      ],
      polls: {
        0: {
          number: 0,
          title: 'Do you prefer cats or dogs', //question
          userVote: -1, 
          hash: '0x8943djfF32mfasdf',
          startBlock: 2,
          endBlock: 9,
          // getInput
          // verifyVote
          // inputReceived
          // pollComplete
          status: 'getInput',
          optionReference: '0x98498453hjkd',
          options: [
            {
              number: 0,
              text: 'Cats',
              img: '',
              votes: 4,
            },
            {
              number: 1,
              text: 'Dogs',
              img: '',
              votes: 99,
            },
          ]
        },
        '0x4323249dsisf': {

        }
      },
    },
    actions: {
      async getPolls ({ commit }) {
        const polls = await this.$axios.$get('http://localhost:3001/state')
        commit('get_polls', polls)
      }
    },
    mutations: {
      increment (state) {
        state.currentBlock++
      },
      vote (state, payload) {
        const poll = state.polls[payload.pollNum]
        poll.userVote = payload.option
        poll.status = 'voteReceived'
      },
      get_polls (state, polls) {
        console.log(polls)
      }
    }
  })
}

export default createStore