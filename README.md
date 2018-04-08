The internet gave everyone a voice. The blockchain gives everyone the economic incentive to use them.

Tenderfeud is a project built for the [Crypto 4 Your Thoughts](https://c4yt.io/) in SF. For more details on
our submission, see [here](https://devpost.com/software/tenderfeud-w13kjr).

## Background

Tenderfeud was built out of our fascination with the blockchain's ability to empower voices with economic
incentives.

It's a poll system with token-incentivized voting

## System design
The application consists of a vue.js/node.js frontend living in `frontend/` and a lotionjs/tendermint
blockchain app (runs a single validator node) living in `lotion_app`.

The project is currently configured expecting the frontend and the validator node to live on the same machine,
but it's pretty straightforward to extend to a cluster of tendermint validators creating the blockchain and a
webserver that interacts with any of them via TCP.

## Mechanism design
Genesis block distributes tokens among some number of people.

From that point, users can either create a poll, view existing polls, or submit a vote for an existing
poll. Creating a poll is expensive and the tokens spent on that poll are lost.

Rather than picking the *best* answer, users are incentivized to pick the answer they think others picked.
This (should) result in a Keynesian beauty contest among poll answers.

This is done by rewarding only those voters who voted on the answer with the most votes. The reward is set by
the poll creator and deducted from the creator's balance. If multiple answers are tied for votes, the poll is
invalidated and the creator gets his/her tokens back.

To avoid the problem of degenerate 'bandwagoning', the poll payout is distributed on an exponential based on
vote order (i.e. early votes get more).

To avoid the degenerate case of only *one* answer, we can set polls up to have a minimum number of answers. If
this minimum *isn't* met by the time the poll ends, the poll creator is refunded their payment.
