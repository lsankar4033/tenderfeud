let lotion = require('lotion');

// TODO: Pass in opts
let polls = require('./src/polls')({});

const pollInitialState = {
  balances: {
    'Ld7g2n7HpdTagJSxyW5o5RLYbAsSqdXxb': 5000, // priv = sha256('lakshman')
    'Boo2q2fEGspWEVxoWiWu5bV4MRGZBL7ut': 5000  // priv = sha256('margarita')
  },
  activePolls: {}
}

// TODO: Use the initial state defined on polls module
let app = lotion({ initialState: pollInitialState })

app.use(polls.txHandler)
app.useBlock(polls.blockHandler)

app.listen(3000)
