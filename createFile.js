import { readMetadata, writeMetadata } from "./metadata.js";
import assert from "node:assert";
import { stripIndent } from "common-tags";
import fs from "fs";
import { setIOFiles } from "./encryptFile.js";

const getProgramText = (year, day) =>
    stripIndent`
        /**
         * --- Day ${day}: cool_title ---
         *
         * https://adventofcode.com/${year}/day/${day}
         *
         * @param {string} input Text Input
         * @returns Problem Solution
         */
        export default function solve(input) {
            const arr = input.split("\\n").map((x) => x);

            const partOne = -1;
            const partTwo = -1;

            return { partOne, partTwo };
        }
    ` + "\n";

const inputText = "";
const outputText = JSON.stringify({ partOne: null, partTwo: null }, null, 4);

function createFolders(...folders) {
    for (const folder of folders) {
        try {
            fs.mkdirSync(folder);
            console.log(`Created '${folder}' folder`);
        } catch (error) {
            if (error.code !== "EEXIST") throw error;
        }
    }
}

const combinedHash = "NOT_A_HASH";

export default function createFile(year, day) {
    const dayPad = String(day).padStart(2, "0");
    const yearFolder = `./year-${year}`;
    const dayFolder = `${yearFolder}/day-${dayPad}`;
    const solveFile = `${dayFolder}/solve.js`;
    const inputFile = `${dayFolder}/input.txt`;
    const outputFile = `${dayFolder}/output.json`;
    const id = `${year}-${dayPad}`;
    const encryptedFolder = `./input-files`;
    const encryptedInputFile = `${encryptedFolder}/${id}.input.bin`;
    const encryptedOutputFile = `${encryptedFolder}/${id}.output.bin`;

    const metadata = readMetadata();
    assert.strictEqual(
        metadata.some((x) => x.id === id),
        false,
        "Duplicate id entry was found",
    );
    metadata.push({
        id,
        year,
        day,
        yearFolder,
        dayFolder,
        solveFile,
        inputFile,
        outputFile,
        encryptedFolder,
        encryptedInputFile,
        encryptedOutputFile,
        combinedHash,
    });

    createFolders(yearFolder, dayFolder, encryptedFolder);
    fs.writeFileSync(solveFile, getProgramText(year, day), {
        flag: "wx",
    });
    fs.writeFileSync(inputFile, inputText, {
        flag: "wx",
    });
    fs.writeFileSync(outputFile, outputText, {
        flag: "wx",
    });
    const createdFiles = setIOFiles(metadata[metadata.length - 1]);
    assert.strictEqual(createdFiles, true, "Encrypted files were not created");
    writeMetadata(metadata);
}
