



// TODO: Options (i.e. initial coinholders, min end block height, parameters)
function polls () {

  let minEndBlockHeight = 500;

  // State in words:
  // - pubkey -> balance
  // - active polls (current votes, end time)
  // - inactive polls (results)

  // State schema
  // {
  //  balances: {pubkey}
  //  polls: {
  //    startBlock
  //    endBlock
  //    active (redundant)
  //    pollId: {
  //      answer: [sorted_pubkeys]
  //    }
  //  }
  // }

  // Create TX Schema
  // question
  // endBlockHeight
  // amountToPutUp
  // creatorAddress
  // txSignature (signed by creator privkey)
  // msgHash
  // (optional) minAnswers

  // Create handling validation rules
  // - creator matches signature
  // - creator has amountToPutUp to put up
  // - min end block height > N
  // - minAnswers > 2

  function createHandler(state, tx, chain) {



  }

}

processCreate = (createTx) => {

  // validate tx (i.e. make sure sender key

}
