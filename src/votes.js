let { verifyTx, sha256, getTxHash } = require('./utils.js');

function() votes {

	// state:
	// update poll with answer/pubkey

	// vote TX Schema:
	// - question
	// - answer
	// - voterAddress
	// - voterPubkey
	// - signature
	// - msgHash

	// validation rules:
	// - voter matches signature
	// - pollId exists for valid active poll

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

}