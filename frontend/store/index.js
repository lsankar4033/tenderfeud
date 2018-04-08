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
    },
    actions: {
      async getBlockchain ({ commit }) {
        const blockchain = await this.$axios.$get('http://localhost:3001/state')
        commit('get_blockchain', blockchain)
      },
      async voteOnBlockchain ({ state, commit }, payload) {
        const pollId = payload.pollId
        const poll = state.activePolls[pollId]
        if (poll) {
          // here we tell backend 
          // sign tx
          const publicKey = utils.privkeyToPubkey(utils.sha256('blah'))
          const tx = {
            type: "vote",
            question: poll.question,
            voterPubkey: publicKey,
            answer: payload.answer
          }

          const sigHash = utils.getTxHash(tx)
          tx.signature = utils.getSignature(sigHash, utils.sha256('blah'))
          const vote = await this.$axios.$post('http://localhost:3001/txs', tx)
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