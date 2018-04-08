"use strict";

let lotion = require('lotion');
require('dotenv').config({path: ".env-node1"});

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
