import { pruneMetadata, readMetadata, writeMetadata } from "./metadata.js";
import assert from "node:assert";
import fs from "fs";

function deleteFolders(...folders) {
    for (const folder of folders) {
        try {
            fs.rmdirSync(folder);
            console.log(`Deleted '${folder}' folder`);
        } catch (error) {
            if (error.code !== "ENOTEMPTY") throw error;
        }
    }
}

function deleteFiles(...files) {
    for (const file of files) {
        try {
            fs.unlinkSync(file);
            // console.log(`Deleted '${file}' file`);
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }
    }
}

export default function deleteFile(year, day) {
    const metadata = readMetadata();
    const data = metadata.find((x) => x.year === year && x.day === day);
    assert.ok(data, "Couldn't find file metadata");

    deleteFiles(
        data.solveFile,
        data.inputFile,
        data.outputFile,
        data.encryptedInputFile,
        data.encryptedOutputFile,
    );
    deleteFolders(data.dayFolder, data.yearFolder, data.encryptedFolder);

    const pruned = pruneMetadata(metadata);
    pruned.removed.forEach((x) =>
        console.log(`Removed '${x.dayFolder}' entry`),
    );
    writeMetadata(pruned.filtered);
}
