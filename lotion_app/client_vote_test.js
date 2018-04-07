
let { post } = require('axios')
let secp = require('secp256k1')
let { sha256, pubkeyToAddress, getTxHash, getSignature } = require('./src/utils.js')

let priv = sha256('margarita')
let pub = secp.publicKeyCreate(priv)

let priv2 = sha256('lakshman')
let pub2 = secp.publicKeyCreate(priv2)

async function main () {
  let tx = {
    type: "vote",
    question: "What is the best cryptocurrency?",
    voterPubkey: pub,
    answer: "bitcoin"
  }

  // sign tx
  let sigHash = getTxHash(tx)
  tx.signature = getSignature(sigHash, priv)

	// 1) margarita: vote bitcoin
  let res = await post('http://localhost:3001/txs', tx)
  console.log(res.data)
  
  tx = {
    type: "vote",
    question: "What is the best cryptocurrency?",
    voterPubkey: pub2,
    answer: "bitcoin"
  }
  
  // sign tx
  sigHash = getTxHash(tx)
  tx.signature = getSignature(sigHash, priv2)

	// 2) lakshman: vote bitcoin
  res = await post('http://localhost:3001/txs', tx)
  console.log(res.data)
  
  tx = {
    type: "vote",
    question: "What is the best cryptocurrency?",
    voterPubkey: pub2,
    answer: "ether"
  }
  
  // sign tx
  sigHash = getTxHash(tx)
  tx.signature = getSignature(sigHash, priv2)

	// 3) lakshman: vote ether
  res = await post('http://localhost:3001/txs', tx)
  console.log(res.data)
  
}
main()