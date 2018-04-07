let { verifyTx, sha256, getTxHash, pubkeyToAddress, clone } = require('./utils.js');

// State schema
// {
//  balances: {address: balance}
//  activePolls: {
//    questionHash: {
//      startBlock
//      endBlock
//      question
//      minAnswers
//      answers: {answer: [sorted_addresses]}
//   }
//  }
//  inactivePolls: {
//    [
//      {
//      startBlock
//      endBlock
//      question
//      minAnswers
//      answers: {answer: [sorted_addresses]}
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

  let found = 0
  for (q in state.activePolls) {
  	if (q == questionHash) {
  		found = 1
    }
  }

  if (found == 0) {
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

const minBlockDuration = 500;
const defaultMinAnswers = 2;

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
  console.log(questionHash)
  let found = 0
  for (q in state.activePolls) {
  	if (q == questionHash) {
  		found = 1
    }
  }

  if (found == 1) {
  	throw Error(`Can't create a poll idential to a currently active poll!`);
  }

  let endBlock = chain.height + tx.endBlockHeight
  state.activePolls[questionHash] = {
    startBlock: tx.startBlock,
    endBlock: tx.endBlock,
    question: tx.question,
    minAnswers: minAnswers,
    answers: {}
  }
}

// TODO: Actually distribute payout...
// Also, if minAnswers not met don't transfer!
function blockHandler(state, chain) {
  let height = chain.height;
  console.log(`Created block at height: ${height}`);

  // check all active polls. if height >= endBlock, move to inactive polls
  let questionsToRemove = []
  for (var questionHash in state.activePolls) {
    let poll = state.activePolls[questionHash]

    if (height >= poll.endBlock) {
      let clonedPoll = clone(poll);
      state.inactivePolls.push(clonedPoll);
      questionsToRemove.push(questionHash);

      console.log(`Removing poll with question: ${poll.question} and end block: ${poll.endBlock}`);
    }
  }

  // delete all inactivated polls from active polls
  for (var questionHash in questionsToRemove) {
    delete state.activePolls[questionHash];
  }
}

// TODO: Options (i.e. initial coinholders, min end block height, parameters)
module.exports = (opts) => {
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
