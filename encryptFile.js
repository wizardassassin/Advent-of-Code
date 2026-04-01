import crypto from "crypto";

const KEY_BYTES = 32;
const IV_BYES = 12;
const TAG_BYTES = 16;
const key = Buffer.from(process.env.SECRET_KEY ?? "", "hex");

// basic check
export function hasSecretKey() {
    return key.length === KEY_BYTES;
}

/**
 *
 * @param {Buffer} buffer
 * @returns
 */
export function encrypt(buffer) {
    const iv = crypto.randomBytes(IV_BYES);
    const cipher = crypto.createCipheriv("chacha20-poly1305", key, iv, {
        authTagLength: TAG_BYTES,
    });
    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final(), // nothing?
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]);
}

/**
 *
 * @param {Buffer} buffer
 * @returns
 */
export function decrypt(buffer) {
    const iv = buffer.subarray(0, IV_BYES);
    const tag = buffer.subarray(IV_BYES, IV_BYES + TAG_BYTES);
    const encrypted = buffer.subarray(IV_BYES + TAG_BYTES);
    const decipher = crypto.createDecipheriv("chacha20-poly1305", key, iv, {
        authTagLength: TAG_BYTES,
    });
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(), // nothing?
    ]);
    return decrypted;
}

/**
 *
 * @param {Buffer} buffer
 * @returns
 */
export function fromFormattedHex(buffer) {
    const hex = buffer.toString("utf-8").replace(/\s*\r?\n\s*/g, "");
    return Buffer.from(hex, "hex");
}

/**
 *
 * @param {Buffer} buffer
 * @returns
 */
export function toFormattedHex(buffer) {
    const hex = buffer.toString("hex");
    const LINE_LENGTH = Math.floor(Math.sqrt(hex.length));
    let output = "";
    for (let i = 0; i < hex.length; i += LINE_LENGTH)
        output += hex.slice(i, i + LINE_LENGTH) + "\n";
    return Buffer.from(output, "utf-8");
}
