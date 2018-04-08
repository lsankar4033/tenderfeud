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
//      payout
//      creator
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
//      payout
//      creator
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
  found = 0
  for (a in poll.answers) {
  	if (a == tx.answer) {
  		found = 1
    }
  }

  if (found == 1) {
    poll.answers[tx.answer].push(voterAddress)
  } else {
  	let ans = tx.answer
    poll.answers[ans] = [voterAddress]
  }
  console.log("new state at end of vote for " + tx.answer + ": " + poll.answers[tx.answer])

}

const minBlockDuration = 500;
const defaultMinAnswers = 2;

// TODO: Change payout validation such that payout + all other outstanding payotus not greater than creator's
// balance
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

  // Make sure poll doesn't already exist
  let creatorSum = 0
  let questionHash = sha256(tx.question)
  let found = 0
  for (q in state.activePolls) {
  	if (q == questionHash) {
  		found = 1
    }
    if (state.activePolls[q].creator == address) {
    	creatorSum += state.activePolls[q].payout
    }
  }

  if (found == 1) {
  	throw Error(`Can't create a poll idential to a currently active poll!`);
  }

  // Validate balance

  let creatorBalance = state.balances[address] || 0;
  if (creatorBalance < tx.payout || (creatorBalance - creatorSum - tx.payout) < 0) {
    throw Error(`Creator's balance of ${creatorBalance} not enough to pay payout ${tx.payout}`);
  }

  // Validate end block height
  if (tx.blockDuration < minBlockDuration) {
    throw Error(`Must specify an end block height > ${minBlockDuration}`);
  }

  // Validate num answers
  let minAnswers = tx.minAnswers || defaultMinAnswers;
  if (minAnswers < 1) {
    throw Error(`Must specify min answers > 1`);
  }

  let endBlock = chain.height + tx.endBlockHeight
  state.activePolls[questionHash] = {
    startBlock: tx.startBlock,
    endBlock: tx.endBlock,
    question: tx.question,
    minAnswers: minAnswers,
    payout: tx.payout,
    creator: address,
    answers: {}
  }
}

// Initially exponential, but play with this. This isn't weighted; it's expected that getPayoutWeights is used
// for that.
function payoutDistFn(n) {
  return Math.exp(-1 * n);
}

function getPayoutWeights(sortedWinners) {
  let weights = sortedWinners.map( (w, i) => payoutDistFn(i) );
  let total = 0;
  for (var w of weights) {
    total += w;
  }

  let normalizedWeights = weights.map( (w) => w / total );

  let winnerToWeight = {}
  for (var i in normalizedWeights) {
    winnerToWeight[sortedWinners[i]] = normalizedWeights[i];
  }
  return winnerToWeight;
}

// Exponential decay by sort order of payout
function winnersToPayouts(sortedWinners, totalPayout) {
  let payoutWeights = getPayoutWeights(sortedWinners);

  let payouts = {}
  for (var winner in payoutWeights) {
    payouts[winner] = payoutWeights[winner] * totalPayout;
  }

  return payouts;
}

// Gets all answers tied for the most votes
function getBestAnswers(answers) {
  let answerCountTuples = Object.entries(answers).map( (e) => [e[0], e[1].length] );

  let highestCount = 0;
  let countToAnswers = {}
  for (tup of answerCountTuples) {
    // NOTE: This pattern sucks
    countToAnswers[tup[1]] = countToAnswers[tup[1]] || []
    countToAnswers[tup[1]].push(tup[0]);

    if (tup[1] > highestCount) {
      highestCount = tup[1];
    }
  }

  // NOTE: Should never happen!
  if (highestCount == 0) {
    return [];
  }

  return countToAnswers[highestCount];
}

// NOTE: Return address -> payout
function pollToPayouts(poll) {
  let answers = poll.answers;

  // No winners if not enough distinct answers
  if (Object.keys(answers).length < poll.minAnswers) {
    return {}
  }

  else {
    let bestAnswers = getBestAnswers(answers);

    // No winners if there's a tie
    if (bestAnswers.length > 1) {
      return {};
    } else {
      let bestAnswer = bestAnswers[0];

      return winnersToPayouts(answers[bestAnswer], poll.payout);
    }
  }
}

function blockHandler(state, chain) {
  let height = chain.height;
  console.log(`Created block at height: ${height}`);
  state.blockHeight = height

  // check all active polls. if height >= endBlock, move to inactive polls
  let toRemove = []
  for (var questionHash in state.activePolls) {
    let poll = state.activePolls[questionHash]

    if (height >= poll.endBlock) {
      let clonedPoll = clone(poll);
      state.inactivePolls.unshift(clonedPoll);
      toRemove.push(questionHash);

      // Distribute winnings among winners
      if (poll.payout > 0) {
        let addressToPayout = pollToPayouts(poll);
        if (Object.keys(addressToPayout).length > 0) {
					state.balances[poll.creator] -= poll.payout;
					for (var payoutAddress in addressToPayout) {
						state.balances[payoutAddress] = state.balances[payoutAddress] || 0;
						state.balances[payoutAddress] += addressToPayout[payoutAddress];
					}
        }
      }
    }
  }

  // delete all inactivated polls from active polls
  for (var questionHash of toRemove) {
    delete state.activePolls[questionHash];
  }
}

// TODO: Options (i.e. initial coinholders, min end block height, parameters)
module.exports = (opts) => {
  return {
    txHandler: (state, tx, chain) => {
      if (tx.type == 'create') {
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
