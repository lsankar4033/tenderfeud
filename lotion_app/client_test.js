
let { post } = require('axios')
let secp = require('secp256k1')
let { sha256, pubkeyToAddress, getTxHash, getSignature } = require('./src/utils.js')

let priv = sha256('lakshman')
let pub = secp.publicKeyCreate(priv)

async function main () {
  let tx = {
    type: "create",
    question: "What is the best cryptocurrency?",
    endBlock: 500,
    startBlock: 10,
    payout: 10,
    creatorPubkey: pub,
  }

  // sign tx
  let sigHash = getTxHash(tx)
  tx.signature = getSignature(sigHash, priv)

  let res = await post('http://localhost:3000/txs', tx)
  console.log(res.data)
}
main()