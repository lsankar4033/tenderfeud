import Vuex from 'vuex'
import utils from '~/front_utils'
const createStore = () => {
  return new Vuex.Store({
    state: {
      blockChain: {},
      blockChainPollIds: [],
      activePollIds: [],
      inactivePollIds: [],
      activePolls: {},
      inactivePolls: {},
      // blocks: [
      //   {
      //     number: 1,
      //     transactions: [],
      //   },
      //   {
      //     number: 2,
      //     transactions: [],
      //   },
      //   {
      //     number: 3,
      //     transactions: [],
      //   },
      //   {
      //     number: 4,
      //     transactions: [],
      //   }
      // ],
      // polls: {
      //   0: {
      //     number: 0,
      //     title: 'Do you prefer cats or dogs', //question
      //     userVote: -1, 
      //     hash: '0x8943djfF32mfasdf',
      //     startBlock: 2,
      //     endBlock: 9,
      //     // getInput
      //     // verifyVote
      //     // inputReceived
      //     // pollComplete
      //     status: 'getInput',
      //     optionReference: '0x98498453hjkd',
      //     options: [
      //       {
      //         number: 0,
      //         text: 'Cats',
      //         img: '',
      //         votes: 4,
      //       },
      //       {
      //         number: 1,
      //         text: 'Dogs',
      //         img: '',
      //         votes: 99,
      //       },
      //     ]
      //   },
      //   '0x4323249dsisf': {

      //   }
      // },
    },
    actions: {
      async getBlockchain ({ commit }) {
        const blockchain = await this.$axios.$get('http://localhost:3001/state')
        commit('get_blockchain', blockchain)
      },
      async voteOnBlockchain ({ state, commit }, payload) {
        const pollId = payload.pollId
        console.log(pollId)
        const poll = state.activePolls[pollId]
        if (poll) {
          // here we tell backend 
          // sign tx
          const publicKey = utils.privkeyToPubkey(utils.sha256('blah'))
          console.log(publicKey)
          const tx = {
            type: "vote",
            question: poll.question,
            voterPubkey: publicKey,
            answer: payload.answer
          }

          const sigHash = utils.getTxHash(tx)
          tx.signature = utils.getSignature(sigHash, utils.sha256('blah'))
          console.log('tx', tx)
          const vote = await this.$axios.$post('http://localhost:3001/txs', tx)
          console.log('vote', vote)
          poll.userVote = payload.answer
          poll.status = 'voteReceived'
        }
        commit('vote')
      }
    },
    mutations: {
      increment (state) {
        state.currentBlock++
      },
      vote (state, payload) {
        console.log('sha', utils.sha256('asdf'))
        
      },
      get_blockchain (state, blockchain) {
        state.blockChain = blockchain
        // state.blockHeight = blockchain.blockHeight
        state.activePollIds = Object.keys(blockchain.activePolls)
        state.inactivePollIds = Object.keys(blockchain.inactivePolls)
        let activePolls = {}
        let inactivePolls = {}
        for (let i = 0; i < state.activePollIds.length; i++) {
          const activePoll = blockchain.activePolls[state.activePollIds[i]]
          activePoll.active = true
          activePoll.id = state.activePollIds[i]
          activePolls[state.activePollIds[i]] = activePoll
        }
        for (let i = 0; i < state.inactivePollIds.length; i++) {
          const inactivePoll = blockchain.inactivePolls[state.inactivePollIds[i]]
          inactivePoll.active = false
          inactivePoll.id = state.inactivePollIds[i]
          inactivePolls[state.inactivePollIds[i]] = inactivePoll
        }
        state.activePolls = Object.assign({}, activePolls)
        state.inactivePolls = Object.assign({}, inactivePolls)
      }
    }
  })
}

export default createStore