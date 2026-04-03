import assert from "node:assert";
import { readMetadata, writeMetadata } from "./metadata.js";
import fs from "fs/promises";
import { updateIOFiles } from "./encryptFile.js";

export default function debugFile(year, day) {
    const metadata = readMetadata();
    const data = metadata.find((x) => x.year === year && x.day === day);
    assert.ok(data, "Couldn't find file metadata");
    debugFile2(data).then((res) => {
        res.duration = res.duration.toFixed(4) + "ms";
        console.log(res);
        const didUpdate = updateIOFiles(data);
        if (didUpdate) writeMetadata(metadata);
    });
}

export async function debugFile2(data, writeOutput = true, disableLog = false) {
    const [program, input] = await Promise.all([
        import(data.solveFile),
        fs
            .readFile(data.inputFile, "utf-8")
            .then((x) => x.toString().replace(/\r/g, "").trim()),
    ]);
    const oldLog = console.log;
    const oldErr = console.error;
    if (disableLog) {
        console.log = () => {};
        console.error = () => {};
    }
    const start = performance.now();
    const output = await program.default(input);
    const stop = performance.now();
    const duration = stop - start;
    if (disableLog) {
        console.log = oldLog;
        console.error = oldErr;
    }
    if (writeOutput) {
        await fs.writeFile(data.outputFile, JSON.stringify(output, null, 4));
    }
    // I think performance.now() only has microsecond accuracy
    return { year: data.year, day: data.day, output, duration };
}
