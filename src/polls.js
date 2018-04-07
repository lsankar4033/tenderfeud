// Interactions to support:
// - create/vote on polls
// - view poll information
// - become a validator (deposit tokens)
// - send tokens

let secp256k1 = require('secp256k1')

let { stringify } = require('lotion/lib/json.js')

let { createHash } = require('crypto')

// TODO: Use this on app initialization
const initialState = {
  balances: {},
  polls: {}
}

function verifyTx(txHash, pubkey, sig) {
  return secp256k1.verify(sigHash, signature, pubkey);
}


function sha256(data) {
  return createHash('sha256').update(data).digest()
}


// Perhaps pull this into its own file that client-side (incl frontend) code uses as well
function txHash(tx) {
  // TODO
}


// TODO: Options (i.e. initial coinholders, min end block height, parameters)
function polls () {

  const minBlockDuration = 500;
  const defaultMinAnswers = 2;

  // State in words:
  // - pubkey -> balance
  // - active polls (current votes, end time)
  // - inactive polls (results)

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

  // Create TX Schema
  // question
  // blockDuration
  // payout
  // creatorPubkey
  // txSignature (signed by creator privkey)
  // (optional) minAnswers

  // TODO: tests!
  function createHandler(state, tx, chain) {
    let pubkey = tx.creatorPubkey;
    let txHash = txHash(tx);

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

    // TODO: Perhaps extract into own method for cleanliness
    let endBlock = chain.height + tx.endBlockHeight
    state.activePolls[questionHash] = {
      startBlock: tx.startBlock,
      endBlock: tx.endBlock,
      question: tx.question,
      answers: {}
    }
  }

}
