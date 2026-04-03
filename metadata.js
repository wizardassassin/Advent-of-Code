import assert from "node:assert";
import fs from "fs";

/**
 * @typedef {Object} AOCData
 * @property {string} id
 * @property {number} year
 * @property {number} day
 * @property {string} yearFolder
 * @property {string} dayFolder
 * @property {string} solveFile
 * @property {string} inputFile
 * @property {string} outputFile
 * @property {string} encryptedFolder
 * @property {string} encryptedInputFile
 * @property {string} encryptedOutputFile
 * @property {string} combinedHash
 */

const metadataFile = "./metadata.json";

export function readMetadata() {
    try {
        /** @type {Array<AOCData>} */
        const data = JSON.parse(fs.readFileSync(metadataFile, "utf-8"));
        assert.strictEqual(
            Array.isArray(data),
            true,
            "Metadata is not an array",
        );
        return data;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    return [];
}
/**
 *
 * @param {Array<AOCData>} metadata
 */
export function sortMetadata(metadata) {
    metadata.sort((a, b) => a.year - b.year || a.day - b.day);
}

/**
 *
 * @param {Array<AOCData>} metadata
 */
export function writeMetadata(metadata) {
    sortMetadata(metadata);
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 4));
}

/**
 *
 * @param {Array<AOCData>} metadata
 */
export function pruneMetadata(metadata) {
    return {
        filtered: metadata.filter((x) => fs.existsSync(x.dayFolder)),
        removed: metadata.filter((x) => !fs.existsSync(x.dayFolder)),
    };
}
