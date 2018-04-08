"use strict";

let lotion = require('lotion');
let { sha256, privkeyToPubkey, pubkeyToAddress, getTxHash, getSignature } = require('./src/utils.js')

require('dotenv').config({path: ".env-node1"});

const awsPeer = '52.53.238.253:46658';

// Could pass this in as a config file later (i.e. via env var)
let lotionOpts = {
  // genesis: '',       // path to genesis.json. generates new one if not specified.
  peers: [awsPeer],     // array of '<host>:<p2pport>' of initial tendermint nodes to connect to. does automatic peer discovery if not specified.
  p2pPort: 46658,       // port to use for tendermint peer connections
  tendermintPort: 46657 // port to use for tendermint rpc
}

// TODO: Pass in opts
let polls = require('./src/polls')({});
const pollInitialState = {
  balances: {
    // 'Ld7g2n7HpdTagJSxyW5o5RLYbAsSqdXxb': 5000, // priv = sha256('lakshman')
    // 'Boo2q2fEGspWEVxoWiWu5bV4MRGZBL7ut': 5000,  // priv = sha256('margarita')
  },
  activePolls: {},
  inactivePolls: []
}
const extraAccts = [
  ['foo', 0],
  ['joe', 0],
  ['john', 0],
  ['bob', 0],
  ['sara', 0],
  ['sue', 0],
  ['asdf', 0],
  ['asdfasdf', 0],
  ['reid', 99999999],
  ['lakshman', 5000], 
  ['margarita', 5000],  
  ['manu', 5000],  
  ['doina', 5000],  
]
for (let i = 0; i < extraAccts.length; i++) {
  const priv = sha256(extraAccts[i][0])
  const pub = privkeyToPubkey(priv)
  const address = pubkeyToAddress(pub)
  pollInitialState.balances[address] = extraAccts[i][1]
}
console.log(pollInitialState)
// TODO: Use  the initial state defined on polls module
let app = lotion({  initialState: pollInitialState })

app.use(polls.txHandler)
app.useBlock(polls.blockHandler)

app.listen(3001).then(({ GCI }) => {
 console.log(GCI)
})
