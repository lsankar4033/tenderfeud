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

### Lotionjs implementation

Create some cloud validators. Distribute code for running validators with these cloud validators hardcoded in
as peers.

Create webapp for non-validators to send transactions.

Lotionjs app should:
- process payment txes
- process poll txes

## Open questions
- ~~how does network work in lotionjs? i.e. how do we network multiple nodes on the same blockchain?~~
  - seems that tendermint under lotion does automatic peer discovery and other lotion nodes can connect to
    your network with their initial list of peers. from there, it's straightforward to create a simple web
    interface for interacting with the thing
- what's the right setting of parameters (payouts, etc.) that incentivize good behaviour?

## Tasks
Tech:
- build v0.1, static validator set
  - (LS) build protocol for token genesis + transfer
  - add on protocol for poll mgmt
- deploy v0.1 to cloud w/webapp potentially
- build v0.2, dynamic validators

Users:
- Decide on some saucy initial polls
- Make friends with 10 ppl who could be early users of what we make

Comp:
- presentation
