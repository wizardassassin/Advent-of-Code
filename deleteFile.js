import { pruneMetadata, readMetadata, writeMetadata } from "./metadata.js";
import assert from "node:assert";
import fs from "fs";

function deleteFolders(yearFolder, dayFolder) {
    try {
        fs.rmdirSync(dayFolder);
        console.log(`Deleted '${dayFolder}' folder`);
    } catch (error) {
        if (error.code !== "ENOTEMPTY") throw error;
    }
    try {
        fs.rmdirSync(yearFolder);
        console.log(`Deleted '${yearFolder}' folder`);
    } catch (error) {
        if (error.code !== "ENOTEMPTY") throw error;
    }
}

export default function deleteFile(year, day) {
    const metadata = readMetadata();
    const data = metadata.find((x) => x.year === year && x.day === day);
    assert.ok(data, "Couldn't find file metadata");

    fs.unlinkSync(data.solveFile);
    fs.unlinkSync(data.inputFile);
    fs.unlinkSync(data.outputFile);
    deleteFolders(data.yearFolder, data.dayFolder);

    const pruned = pruneMetadata(metadata);
    pruned.removed.forEach((x) =>
        console.log(`Removed '${x.dayFolder}' entry`)
    );
    writeMetadata(pruned.filtered);
}
