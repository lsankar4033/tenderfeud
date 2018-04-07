let { createHash } = require('crypto')
let secp256k1 = require('secp256k1')

let { stringify } = require('lotion/lib/json.js')

function signTx(txHash, privkey) {
  let sigObj = secp256k1.sign(txHash, privkey)
  return sigObj.signature;
}

function verifyTx(txHash, pubkey, sig) {
  return secp256k1.verify(sigHash, signature, pubkey);
}

function sha256(data) {
  return createHash('sha256').update(data).digest()
}

// NOTE: This is used on client-side and app-side, so must now know about signature
function getTxHash(tx) {
  tx = clone(tx)
  delete tx['signature']

  let txString = stringify(tx)
  return sha256(txString)
}

module.exports = {
  verifyTx,
  sha256,
  getTxHash
}
