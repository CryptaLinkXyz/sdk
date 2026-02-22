import crypto from "crypto"

export function generateKeyPair() {
  const ecdh = crypto.createECDH("secp256k1")
  ecdh.generateKeys()
  return {
    publicKey: ecdh.getPublicKey("hex"),
    privateKey: ecdh.getPrivateKey("hex")
  }
}

export function deriveSharedSecret(
  privateKey: string,
  publicKey: string
) {
  const ecdh = crypto.createECDH("secp256k1")
  ecdh.setPrivateKey(Buffer.from(privateKey, "hex"))
  return ecdh.computeSecret(Buffer.from(publicKey, "hex"))
}

export function encryptMessage(secret: Buffer, message: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", secret.slice(0, 32), iv)
  let encrypted = cipher.update(message, "utf8", "hex")
  encrypted += cipher.final("hex")

  return {
    payload: encrypted,
    iv: iv.toString("hex")
  }
}

export function decryptMessage(
  secret: Buffer,
  payload: string,
  iv: string
) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secret.slice(0, 32),
    Buffer.from(iv, "hex")
  )

  let decrypted = decipher.update(payload, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
