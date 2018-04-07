let { sha256, getTxHash, getSignature, privkeyToPubkey, pubkeyToAddress } = require('../src/utils.js');
let assert = require('assert');

function buildVoteTx(txOpts, privkey) {
  txOpts['type'] = 'vote';
  let txHash = getTxHash(txOpts);
  txOpts['signature'] = getSignature(txHash, privkey);

  return txOpts;
}

describe('VoteHandler', function() {

  // TODO: all appropriate validations
  // vote is created/incremented properly

  it('should increment the relevant vote by address/poll', () => {
  	let polls = require('../src/polls')({});
    let answer = 'bitcoin';

    let activePoll = buildPoll({}, 
    	{
        [answer]: ['jae kwon', 'nick szabo'],
        'my boi': ['craig wright']
      })

    let state = {
      balances: {
        'foo': 100
      },
      activePolls: {
        [defaultQHash]: activePoll
      }
    };

    let privkey = sha256('satoshi');
    let pubkey = privkeyToPubkey(privkey);

    let tx = buildVoteTx({
      question: defaultQuestion,
      voterPubkey: pubkey,
      answer: answer
    }, privkey);

    let chain = {};

    polls.txHandler(state, tx, chain);

    let address = pubkeyToAddress(pubkey);
    let answerVotes = state.activePolls[defaultQHash].answers[answer];
    assert.equal(answerVotes.length, 3);
    assert.equal(answerVotes[2], address);
  });
  
  it('should add new answer the relevant vote by address/poll', () => {
    let polls = require('../src/polls')({});
    let answer = 'ether';

    let activePoll = buildPoll({}, {})

    let state = {
      balances: {
        'foo': 100
      },
      activePolls: {
        [defaultQHash]: activePoll
      }
    };

    let privkey = sha256('satoshi');
    let pubkey = privkeyToPubkey(privkey);

    let tx = buildVoteTx({
      question: defaultQuestion,
      voterPubkey: pubkey,
      answer: answer
    }, privkey);

    let chain = {};

    polls.txHandler(state, tx, chain);

    let address = pubkeyToAddress(pubkey);
    let answerVotes = state.activePolls[defaultQHash].answers[answer];
    assert.equal(answerVotes.length, 1);
    assert.equal(answerVotes[0], address);
  });
  
  it('should throw error on invalid poll question', () => {
    let polls = require('../src/polls')({});
    let question = 'who is vitalik?';
    let questionHash = sha256(question)
    let answer = 'just a friend';

    let state = {
      balances: {
        'foo': 100
      },
      activePolls: {

      }
    };

    let privkey = sha256('satoshi');
    let pubkey = privkeyToPubkey(privkey);

    let tx = buildVoteTx({
      question: question,
      voterPubkey: pubkey,
      answer: answer
    }, privkey);

    let chain = {};
		let expError = "Poll is invalid or inactive"
		var error;
		try {
  		polls.txHandler(state, tx, chain)
		} catch (e) {
  		error = e;
		}
    assert.equal(error.message, expError)

  });

  it('should throw error on invalid signature', () => {
  	let polls = require('../src/polls')({});
    let answer = 'me';

    let activePoll = buildPoll({}, {})

    let state = {
      balances: {
        'foo': 100
      },
      activePolls: {
        [defaultQHash]: activePoll
      }
    };

    let privkey = sha256('satoshi');
    let pubkey = privkeyToPubkey(sha256('dummy'));

    let tx = buildVoteTx({
      question: defaultQuestion,
      voterPubkey: pubkey,
      answer: answer
    }, privkey);

    let chain = {};
		let expError = "Signature does not match public key!"
		var error;
		try {
  		polls.txHandler(state, tx, chain)
		} catch (e) {
  		error = e;
		}
    assert.equal(error.message, expError)

  });
});
