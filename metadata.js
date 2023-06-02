import assert from "node:assert";
import fs from "fs";

const metadataFile = "./metadata.json";

export function readMetadata() {
    try {
        /** @type {Array<any>} */
        const data = JSON.parse(fs.readFileSync(metadataFile, "utf-8"));
        assert.strictEqual(
            Array.isArray(data),
            true,
            "Metadata is not an array"
        );
        return data;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    return [];
}
/**
 *
 * @param {Array<any>} metadata
 */
export function sortMetadata(metadata) {
    metadata.sort((a, b) => a.year - b.year || a.day - b.day);
}

/**
 *
 * @param {Array<any>} metadata
 */
export function writeMetadata(metadata) {
    sortMetadata(metadata);
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 4));
}

/**
 *
 * @param {Array<any>} metadata
 */
export function pruneMetadata(metadata) {
    return {
        filtered: metadata.filter((x) => fs.existsSync(x.dayFolder)),
        removed: metadata.filter((x) => !fs.existsSync(x.dayFolder)),
    };
}
