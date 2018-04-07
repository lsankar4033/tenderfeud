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
    let question = 'who is vitalik?';
    let questionHash = sha256(question)
    let answer = 'just a friend';

    let polls = require('../src/polls')({});

    let state = {
      balances: {
        'foo': 100
      },
      activePolls: {
        [questionHash]: {
          startBlock: 10,
          endBlock: 100,
          question: question,
          minAnswers: 100,
          answers: {
            [answer]: ['jae kwon', 'nick szabo'],
            'my boi': ['craig wright']
          }
        }
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

    polls.txHandler(state, tx, chain);

    let address = pubkeyToAddress(pubkey);
    let answerVotes = state.activePolls[questionHash].answers[answer];
    assert.equal(answerVotes.length, 3);
    assert.equal(answerVotes[2], address);
  });

});
