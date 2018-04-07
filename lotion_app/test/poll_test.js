let { sha256, clone, getTxHash, getSignature, privkeyToPubkey, pubkeyToAddress } = require('../src/utils.js');
let assert = require('assert');

function buildVoteTx(txOpts, privkey) {
  txOpts['type'] = 'vote';
  let txHash = getTxHash(txOpts);
  txOpts['signature'] = getSignature(txHash, privkey);

  return txOpts;
}

const defaultQuestion = "who's the fairest crypto of them all?";
const defaultQHash = sha256(defaultQuestion);
const defaultCreatorAddress = "foobar"

function buildPoll(opts = {}, answers = {}) {
  return {
    startBlock: opts['startBlock'] || 10,
    endBlock: opts['endBlock'] || 10,
    minAnswers: opts['minAnswers'] || 10,
    question: opts['question'] || defaultQuestion,
    payout: opts['payout'] || 0,
    creator: opts['creator'] || defaultCreatorAddress,
    answers: answers
  }
}

describe('CreateHandler', function() {
  it('should throw error on existing active poll question', () => {
  	let polls = require('../src/polls')({});

    let activePoll = buildPoll({},
    	{
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
    let address = pubkeyToAddress(pubkey);

  	let tx = {
    	type: "create",
    	question: defaultQuestion,
    	endBlock: 500,
    	startBlock: 10,
			payout: 10,
			creatorPubkey: pubkey,
    	creator: address,
  	}

  	let sigHash = getTxHash(tx)
  	tx.signature = getSignature(sigHash, privkey)

    let chain = {};

		let expError = "Can't create a poll idential to a currently active poll!"
		var error;
		try {
  		polls.txHandler(state, tx, chain)
		} catch (e) {
  		error = e;
		}
    assert.equal(error.message, expError)

  });

  it('should throw error on insufficient funds', () => {
  	let polls = require('../src/polls')({});

  	let privkey = sha256('satoshi');
    let pubkey = privkeyToPubkey(privkey);
    let address = pubkeyToAddress(pubkey);

    let activePoll = buildPoll({ creator :  address},
    	{
        'my boi': ['craig wright']
      })
    console.log("creator is: " + activePoll.creator)

    let state = {
      balances: {
        [address] : 12
      },
      activePolls: {
        [defaultQHash]: activePoll
      }
    };

  	let tx = {
    	type: "create",
    	question: "another q",
    	endBlock: 500,
    	startBlock: 10,
			payout: 10,
			creatorPubkey: pubkey,
    	creator: address,
  	}

  	let sigHash = getTxHash(tx)
  	tx.signature = getSignature(sigHash, privkey)

    let chain = {};

		let expError = "not enough to pay payout"
		var error;
		try {
  		polls.txHandler(state, tx, chain)
		} catch (e) {
  		error = e;
		}

    assert.notEqual(error.message.indexOf(expError), -1)

  });
});


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

describe('BlockHandler', () => {

  it("should move an active poll to inactive iff the current block height exceeds the poll's endBlock", () => {
    let polls = require('../src/polls')({});

    let poll = buildPoll({endBlock: 5, payout: 0});
    let initState = {
      activePolls: {
        [defaultQHash]: poll
      },
      inactivePolls: [],
      blockHeight: 3
    }
    let mutableState = clone(initState);

    console.log(`State: ${JSON.stringify(poll)}`);

    polls.blockHandler(mutableState, {height: 3})
    assert.deepStrictEqual(mutableState, initState);

		initState = {
      activePolls: {
        [defaultQHash]: poll
      },
      inactivePolls: [],
      blockHeight: 5
    }
    mutableState = clone(initState);
    polls.blockHandler(mutableState, {height: 5});
    assert.deepStrictEqual(mutableState, {activePolls: {}, inactivePolls: [poll], blockHeight: 5});
  });

  describe('payouts', () => {

    it("doesn't pay anyone out if fewer than required distinct answers", () => {
      // TODO
    });

    it("doesn't pay anyone out if multiple answers tied for top spot", () => {
      // TODO
    });

    it("pays from creator to winners based on winner vote order", () => {
      let polls = require('../src/polls')({});

      let poll = buildPoll(
        {
          endBlock: 5,
          minAnswers: 2,
          creator: '0',
          payout: 10
        },
        {
          'winning': ['1', '2', '3'],
          'losing': ['0']
        }
      );
      let state = {
        balances: {
          '0': 10
        },
        activePolls: {
          [defaultQHash]: poll
        },
        inactivePolls: []
      }

      polls.blockHandler(state, {height: 5});

      let newBalances = state.balances;
      assert.equal(newBalances['0'], 0);

      // NOTE: May want to match to specific weight fn later
      assert.equal(newBalances['1'] > newBalances['2'], true);
      assert.equal(newBalances['2'] > newBalances['3'], true);
      assert.equal(newBalances['1'] + newBalances['2'] + newBalances['3'], 10);
    });


  });


});
