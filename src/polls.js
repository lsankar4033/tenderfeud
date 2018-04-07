let { verifyTx, sha256, getTxHash } = require('./utils.js');

// State schema
// {
//  balances: {address: balance}
//  activePolls: {
//    questionHash: {
//      startBlock
//      endBlock
//      question
//      answers: {answer: [sorted_addresses]}
//   }
//  }
//  inactivePolls: {
//    [
//      {
//        question
//        answers: {answer: [sorted_addresses]}
//        startBlock
//        endBlock
//      }
//    ]
//  }
// }

function voteHandler(state, tx, chain) {
  let pubkey = tx.voterPubkey;
  let txHash = getTxHash(tx);
  let voterAddress = pubkeyToAddress(pubkey)

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
    poll.answers[tx.answer].push(voterAddress)
  } else {
  	let ans = tx.answer
    answer = { ans : [tvoterAddress] }
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
  let address = pubkeyToAddress(pubkey);
  let txHash = getTxHash(tx);

  // Validate signature
  if (!verifyTx(txHash, pubkey, tx.signature)) {
    throw Error(`Signature does not match public key!`)
  }

  // Validate balance
  let creatorBalance = state.balances[address] || 0;
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
module.exports = (opts) => {
  const minBlockDuration = 500;
  const defaultMinAnswers = 2;

  return {
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
