Family Feud on tendermint.

## Design overview
Genesis block distributes tokens among some number of people (manual pre-sale among other attendees?).

From that point, users can either create a poll, view existing polls, or submit a vote for an existing
poll. Creating a poll is expensive and the tokens spent on that poll are lost.

Rather than picking the *best* answer, users will be incentivized to pick the answer they think others
picked. Sorta like family feud. This is done by rewarding voters based on how what portion of votes were for
their option. We could experiment with different functions here:
- proportional (linear) to vote proportion
- all reward to winner
- logarithmic based on vote proportion (don't reward winner *too* much)

To avoid the degenerate case of only *one* answer, we can set polls up to have a minimum number of answers. If
this minimum *isn't* met by the time the poll ends, the poll creator is refunded their payment. Maybe there's
some default minimum, but we could also make this set-able by the poll creator.

## Open questions
- is it easy to set up lotionjs w/tendermint node?
- how are genesis validators/initial coins set up?
- how do we set up the 'testnet'?
- what's the right setting of parameters (payouts, etc.) that incentivize good behaviour?

## Tasks
- Decide on genesis polls
- Make friends with 10 ppl who could be early users of what we make
- Build poll protocol (expand out...)
- Create testnet deployment
- presentation...?
...
- make this README better

## Dependencies
- tendermint + abci
- pipenv (for dependency mgmt)
