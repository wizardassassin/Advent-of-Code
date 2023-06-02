import { readMetadata, writeMetadata } from "./metadata.js";
import assert from "node:assert";
import { stripIndent } from "common-tags";
import fs from "fs";

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

function createFolders(yearFolder, dayFolder) {
    try {
        fs.mkdirSync(yearFolder);
        console.log(`Created '${yearFolder}' folder`);
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }
    try {
        fs.mkdirSync(dayFolder);
        console.log(`Created '${dayFolder}' folder`);
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }
}

export default function createFile(year, day) {
    const dayPad = String(day).padStart(2, "0");
    const yearFolder = `./year-${year}`;
    const dayFolder = `${yearFolder}/day-${dayPad}`;
    const solveFile = `${dayFolder}/solve.js`;
    const inputFile = `${dayFolder}/input.txt`;
    const outputFile = `${dayFolder}/output.json`;
    const id = `${year}-${dayPad}`;

    const metadata = readMetadata();
    assert.strictEqual(
        metadata.some((x) => x.id === id),
        false,
        "Duplicate id entry was found"
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
    });

    createFolders(yearFolder, dayFolder);
    fs.writeFileSync(solveFile, getProgramText(year, day), {
        flag: "wx",
    });
    fs.writeFileSync(inputFile, "", {
        flag: "wx",
    });
    fs.writeFileSync(
        outputFile,
        JSON.stringify({ partOne: null, partTwo: null }, null, 4),
        {
            flag: "wx",
        }
    );
    writeMetadata(metadata);
}
