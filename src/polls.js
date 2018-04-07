let { verifyTx, sha256, getTxHash } = require('./utils.js');

// State schema
// {
//  balances: {pubkey}
//  activePolls: {
//    questionHash: {
//      startBlock
//      endBlock
//      question
//      answers: {answer: [sorted_pubkeys]}
//   }
//  }
//  inactivePolls: {
//    [
//      {
//        question
//        answers: {answer: [sorted_pubkeys]}
//        startBlock
//        endBlock
//      }
//    ]
//  }
// }

function voteHandler(state, tx, chain) {
  let pubkey = tx.voterPubkey;
  let txHash = getTxHash(tx);

  // Validate signature
  if (!verifyTx(txHash, pubkey, tx.signature)) {
    throw Error('Signature does not match public key!')
  }

  let questionHash = sha256(tx.question)
  if (questionHash in state.activePolls) {
    throw Error('Poll is invalid or inactive')
  }

  let poll = state.activePolls[questionHash]

  if (tx.answer in poll.answers) {
    poll.answers[tx.answer].push(tx.voterAddress)
  } else {
    answer = { tx.answer : [tx.voterAddress] }
    poll.answers.push(answer)
  }
}

function createHandler(state, tx, chain) {
  // Create TX Schema
  // question
  // blockDuration
  // payout
  // creatorPubkey
  // txSignature (signed by creator privkey)
  // (optional) minAnswers

  let pubkey = tx.creatorPubkey;
  let txHash = getTxHash(tx);

  // Validate signature
  if (!verifyTx(txHash, pubkey, tx.signature)) {
    throw Error(`Signature does not match public key!`)
  }

  // Validate balance
  let creatorBalance = state.balances[pubkey] || 0;
  if (creatorBalance < tx.payout) {
    throw Error(`Creator's balance of ${creatorBalance} not enough to pay payout ${tx.payout}`);
  }

  // Validate end block height
  if (tx.blockDuration < minBlockDuration) {
    throw Error(`Must specify an end block height > ${minBlockDuration}`);
  }

  // Validate num answers
  let minAnswers = tx.minAnswers || defaultMinAnswers;
  if (minAnswers < 2) {
    throw Error(`Must specify min answers > 2`);
  }

  // Make sure poll doesn't already exist
  let questionHash = sha256(tx.question)
  if (questionHash in state.activePolls) {
    throw Error(`Can't create a poll idential to a currently active poll!`);
  }

  let endBlock = chain.height + tx.endBlockHeight
  state.activePolls[questionHash] = {
    startBlock: tx.startBlock,
    endBlock: tx.endBlock,
    question: tx.question,
    answers: {}
  }
}


function blockHandler(state, chain) {
  // TODO: Implement!
}

// TODO: Options (i.e. initial coinholders, min end block height, parameters)
function polls (opts) {
  const minBlockDuration = 500;
  const defaultMinAnswers = 2;

  const initialState = {
    balances: {},
    polls: {}
  }

  return {
    initialState: initialState,

    txHandler: (state, tx, chain) => {
      if (tx.type === 'create') {
        createHandler(state, tx, chain);
      } else if (tx.type == 'vote') {
        voteHandler(state, tx, chain);
      } else {
        throw Error(`Unsupported tx type: ${tx}`);
      }
    },

    blockHandler: blockHandler

  }
}

module.exports = {
  polls
  initialState
}
