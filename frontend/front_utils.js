let { createHash } = require('crypto')
let secp256k1 = require('secp256k1')
let base58check = require('bs58check')

let { stringify } = require('lotion/lib/json.js')

function getSignature(txHash, privkey) {
  let sigObj = secp256k1.sign(txHash, privkey)
  return sigObj.signature;
}

function verifyTx(txHash, pubkey, sig) {
  return secp256k1.verify(txHash, sig, pubkey);
}

function sha256(data) {
  return createHash('sha256').update(data).digest()
}

function ripemd160(data) {
  return createHash('ripemd160').update(data).digest()
}

function pubkeyToAddress(pubkey) {
  let hash = ripemd160(sha256(pubkey))
  return base58check.encode(hash)
}

function privkeyToPubkey(privkey) {
  return secp256k1.publicKeyCreate(privkey);
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// NOTE: This is used on client-side and app-side, so must now know about signature
function getTxHash(tx) {
  tx = clone(tx)
  delete tx['signature']

  let txString = stringify(tx)
  return sha256(txString)
}

export default {
  clone,
  verifyTx,
  pubkeyToAddress,
  privkeyToPubkey,
  getSignature,
  sha256,
  getTxHash
}
