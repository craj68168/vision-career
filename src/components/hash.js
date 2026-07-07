// secure-encrypt.js
// Usage:
//   node secure-encrypt.js encrypt "your secret text" "strong-password"
//   node secure-encrypt.js decrypt "<output-from-encrypt>" "strong-password"

const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;
const SALT_LEN = 16;
const SCRYPT_N = 2 ** 15; // good default balance
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function deriveKey(password, salt) {
  return crypto.scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
}

function encryptText(plainText, password) {
  const salt = crypto.randomBytes(SALT_LEN);
  const iv = crypto.randomBytes(IV_LEN);
  const key = deriveKey(password, salt);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload = {
    v: 1,
    algo: ALGO,
    kdf: "scrypt",
    params: {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
    },
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function decryptText(encodedPayload, password) {
  const json = Buffer.from(encodedPayload, "base64").toString("utf8");
  const payload = JSON.parse(json);

  if (payload.algo !== ALGO || payload.kdf !== "scrypt") {
    throw new Error("Unsupported payload format");
  }

  const salt = Buffer.from(payload.salt, "base64");
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const encrypted = Buffer.from(payload.data, "base64");

  const key = crypto.scryptSync(password, salt, KEY_LEN, payload.params);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

function main() {
  const [, , action, text, password] = process.argv;

  if (!action || !text || !password) {
    console.error(
      'Usage:\n  node secure-encrypt.js encrypt "text" "password"\n  node secure-encrypt.js decrypt "payload" "password"',
    );
    process.exit(1);
  }

  try {
    if (action === "encrypt") {
      const out = encryptText(text, password);
      console.log(out);
    } else if (action === "decrypt") {
      const out = decryptText(text, password);
      console.log(out);
    } else {
      throw new Error('Action must be "encrypt" or "decrypt"');
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
