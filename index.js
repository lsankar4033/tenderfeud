let lotion = require('lotion');

// TODO: Pass in opts
let polls = require('polls')({});

const pollInitialState = {
  balances: {

  },
  polls: {}
}

// TODO: Use the initial state defined on polls module
let app = lotion({ initialState: polls.initialState })

app.use(polls.txHandler)
app.useBlock(polls.blockHandler)

app.listen(3000)
