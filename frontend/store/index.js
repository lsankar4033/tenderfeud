import Vuex from 'vuex'
import utils from '~/front_utils'
let secp = require('secp256k1')

// TODO: should we remove this bogus initialization?
// const username = 'blah'
// const priv = utils.sha256(username)
// const pub = secp.publicKeyCreate(priv)
const createStore = () => {
  return new Vuex.Store({
    state: {
      balances: {},
      blockChain: {},
      blockChainPollIds: [],
      activePollIds: [],
      inactivePollIds: [],
      activePolls: {},
      inactivePolls: {},
      user: {
        votes: [],
        name: null,
        publicKey: null,
        address: null,
        balance: 0,
        authError: false,
      },
      createPollVisible: false
    },
    actions: {
      async getBlockchain ({ commit }) {
        // const blockchain = await this.$axios.$get('http://52.53.238.253:46657/state')
        const blockchain = await this.$axios.$get('http://localhost:3001/state')
        commit('get_blockchain', blockchain)
      },
      async voteOnBlockchain ({ state, commit }, payload) {
        const pollId = payload.pollId
        const poll = state.activePolls[pollId]
        if (poll) {
          // here we tell backend
          // sign tx
          const privUser = utils.sha256(state.user.name)
          const pubUser = secp.publicKeyCreate(privUser)

          const tx = {
            type: "vote",
            question: poll.question,
            voterPubkey: pubUser,
            answer: payload.answer
          }
          const sigHash = utils.getTxHash(tx)

          tx.signature = utils.getSignature(sigHash, privUser)
          // console.log(utils.pubkeyToAddress(utils.('blah')))
          const vote = await this.$axios.$post('http://localhost:3001/txs', tx)
          commit('vote', payload)
        }
      },
      async createNewPoll ({ state, commit }, payload) {
        const questionString = payload.questionString
        // here we tell backend
        // sign tx
        const privUser = utils.sha256(state.user.name)
        const pubUser = secp.publicKeyCreate(privUser)

        const tx = {
          type: "create",
          question: questionString,
          creatorPubkey: pubUser,
          payout: payload.payout,
          endBlock: state.blockChain.blockHeight + parseInt(payload.blockLifetime),
          startBlock: state.blockChain.blockHeight,
        }
        console.log(tx)
        const sigHash = utils.getTxHash(tx)
        tx.signature = utils.getSignature(sigHash, privUser)
        const create = await this.$axios.$post('http://localhost:3001/txs', tx)
        console.log(create)
      }
    },
    mutations: {
      increment (state) {
        state.currentBlock++
      },
      vote (state, payload) {
        state.user.votes.push({
          id: payload.pollId,
          answer: payload.answer,
        })
      },
      authError(state, boolean) {
        state.user.authError = boolean
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
        state.activePolls = Object.assign(state.activePolls, activePolls)
        state.inactivePolls = Object.assign({}, inactivePolls)
        console.log(blockchain.balances)
        state.balances = blockchain.balances
      },
      set_user (state, userName) {
        state.user.name = userName
        let privkey = utils.sha256(userName)
        
        state.user.publicKey = utils.privkeyToPubkey(privkey)
        const address = utils.pubkeyToAddress(state.user.publicKey)
        state.user.address = address
        const balance = state.balances[address]
        state.user.balance = balance || 0
      },
      toggle_create_poll (state, pollVisible) {
        state.createPollVisible = pollVisible
      }
    }
  })
}

export default createStore
