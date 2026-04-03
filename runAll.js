import { readMetadata, sortMetadata } from "./metadata.js";
import { debugFile2 } from "./debugFile.js";
import fs from "fs/promises";
import crypto from "crypto";
import assert from "assert/strict";
import {
    hasSecretKey,
    getIOFiles,
    fromFormattedHex,
    encodeData,
} from "./encryptFile.js";

export default async function runAll(removeOutput = false) {
    const store = [];
    const metadata = readMetadata();
    sortMetadata(metadata);
    await decryptAll(metadata);
    for (const data of metadata) {
        const res = await debugFile2(data, false, removeOutput); // non destructive run
        const res2 = structuredClone(res);
        const dayPad = String(res2.day).padStart(2, "0");
        const res3 = { id: `${res2.year}-${dayPad}`, ...res2 };
        store.push(res3);
        res.duration = res.duration.toFixed(4) + "ms";
        if (removeOutput)
            res.output = { partOne: "**REMOVED**", partTwo: "**REMOVED**" };
        console.log(res);
    }
    await fs.writeFile("./data.json", JSON.stringify(store, null, 4));
}

export async function validate(removeOutput = false) {
    try {
        const metadata = readMetadata();
        const data = JSON.parse(await fs.readFile("./data.json", "utf-8"));
        assert.strictEqual(metadata.length, data.length);
        const len = metadata.length;
        const key = crypto.randomBytes(32);
        for (let i = 0; i < len; i++) {
            const meta_i = metadata[i];
            const data_i = data[i];
            assert.strictEqual(meta_i.id, data_i.id);
            assert.strictEqual(meta_i.year, data_i.year);
            assert.strictEqual(meta_i.day, data_i.day);
            const out_data = JSON.parse(
                await fs.readFile(meta_i.outputFile, "utf-8"),
            );
            if (!removeOutput) {
                assert.deepStrictEqual(out_data, data_i.output);
            } else {
                const hash1 = crypto
                    .createHmac("sha256", key)
                    .update(JSON.stringify(out_data, null, 4))
                    .digest("hex");
                const hash2 = crypto
                    .createHmac("sha256", key)
                    .update(JSON.stringify(data_i.output, null, 4))
                    .digest("hex");
                assert.deepStrictEqual(hash1, hash2);
            }
            if (hasSecretKey()) {
                data[i].output = fromFormattedHex(
                    encodeData(
                        Buffer.from(JSON.stringify(data[i].output, null, 4)),
                    ),
                ).toString("hex");
            } else {
                data[i].output = fromFormattedHex(
                    await fs.readFile(meta_i.encryptedOutputFile, "utf-8"),
                ).toString("hex");
            }
        }
        await fs.writeFile("./data.enc.json", JSON.stringify(data, null, 4));
        console.log("Validated data.json!");
    } catch (error) {
        if (
            !String(error.path).endsWith("data.json") ||
            error.code !== "ENOENT"
        )
            throw error;
        console.error("data.json file not found");
    }
}

async function decryptAll(metadata) {
    if (!hasSecretKey()) return;
    const res = metadata.map(async (data) => {
        const inputExists = (
            await Promise.all([
                fileExists(data.inputFile),
                fileExists(data.outputFile),
            ])
        ).every((x) => x);
        if (!inputExists) getIOFiles(data);
    });
    await Promise.all(res);
}

async function fileExists(file) {
    return await fs
        .lstat(file)
        .then((x) => x.isFile())
        .catch((err) => {
            if (err.code !== "ENOENT") throw err;
            return false;
        });
}
