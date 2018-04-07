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
      polls:{
        0: {
          number: 12,
          title: 'Do you prefer cats or dogs',
          userVote: -1,
          hash: '0x8943djfF32mfasdf',
          startBlock: 2,
          endBlock: 9,
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
        1: {

        }
      },
    },
    mutations: {
      increment (state) {
        state.currentBlock++
      },
      vote (state, payload) {
        state.polls[payload.pollNum].userVote = option
      }
    }
  })
}

export default createStore