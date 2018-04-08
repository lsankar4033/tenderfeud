"use strict";

let lotion = require('lotion');
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
    'Ld7g2n7HpdTagJSxyW5o5RLYbAsSqdXxb': 5000, // priv = sha256('lakshman')
    'Boo2q2fEGspWEVxoWiWu5bV4MRGZBL7ut': 5000  // priv = sha256('margarita')
  },
  activePolls: {},
  inactivePolls: []
}

// TODO: Use the initial state defined on polls module
let app = lotion({  genesis: "./genesis.json", 
										keys: "/Users/mmiranda/Desktop/privkey0.json", 
										peers: ["localhost:30096"], 
										tendermintPort: 30092, 
										initialState: pollInitialState,
										devMode: true,
										p2pPort: 30095,
										logTendermint: true,
										})

app.use(polls.txHandler)
app.useBlock(polls.blockHandler)

app.listen(3001).then(({ GCI }) => {
 console.log(GCI)
})
