import crypto from "crypto";
import fs from "fs";
import zlib from "zlib";

const KEY_BYTES = 32;
const IV_BYES = 12;
const TAG_BYTES = 16;
const key = Buffer.from(process.env.SECRET_KEY ?? "", "hex");

// basic check
export function hasSecretKey() {
    return key.byteLength === KEY_BYTES;
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
function toFormattedHex(buffer) {
    const hex = buffer.toString("hex");
    const LINE_LENGTH = Math.floor(Math.sqrt(hex.length));
    let output = "";
    for (let i = 0; i < hex.length; i += LINE_LENGTH)
        output += hex.slice(i, i + LINE_LENGTH) + "\n";
    return Buffer.from(output, "utf-8");
}

/**
 *
 * @param {Buffer} buffer
 * @returns
 */
function fromFormattedHex(buffer) {
    const hex = buffer.toString("utf-8").replace(/\s*\r?\n\s*/g, "");
    return Buffer.from(hex, "hex");
}

/**
 *
 * @param {Buffer} buffer
 */
export function encodeData(buffer) {
    return toFormattedHex(encrypt(zlib.gzipSync(buffer)));
}

/**
 *
 * @param {Buffer} buffer
 */
export function decodeData(buffer) {
    return zlib.gunzipSync(decrypt(fromFormattedHex(buffer)));
}

/**
 *
 * @param {string} str
 */
function hashString(str) {
    return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 *
 * @param {string} inputText
 * @param {string} outputText
 * @returns
 */
export function generateIOHash(inputText, outputText) {
    const inputFileHash = hashString(inputText);
    const outputFileHash = hashString(outputText);
    return hashString(`${inputFileHash}\n${outputFileHash}`);
}

/**
 *
 * @param {AOCData} data
 * @returns
 */
export function updateIOFiles(data) {
    if (!hasSecretKey()) {
        console.log("No secret key was found... skipping");
        return false;
    }
    const inputText = fs.readFileSync(data.inputFile, "utf-8");
    const outputText = fs.readFileSync(data.outputFile, "utf-8");
    const hash = generateIOHash(inputText, outputText);
    if (hash !== data.combinedHash) {
        fs.writeFileSync(data.encryptedInputFile, encodeData(inputText));
        fs.writeFileSync(data.encryptedOutputFile, encodeData(outputText));
        data.combinedHash = hash;
        console.log("Updated input files");
        return true;
    }
    return false;
}
