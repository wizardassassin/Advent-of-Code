import { readMetadata, sortMetadata } from "./metadata.js";
import { debugFile2 } from "./debugFile.js";
import fs from "fs/promises";
import assert from "assert/strict";

export default async function runAll() {
    const store = [];
    const metadata = readMetadata();
    sortMetadata(metadata);
    for (const data of metadata) {
        const res = await debugFile2(data);
        const res2 = structuredClone(res);
        const dayPad = String(res2.day).padStart(2, "0");
        const res3 = { id: `${res2.year}-${dayPad}`, ...res2 };
        store.push(res3);
        res.duration = res.duration.toFixed(4) + "ms";
        console.log(res);
    }
    await fs.writeFile("./data.json", JSON.stringify(store, null, 4));
}

export async function validate() {
    try {
        const metadata = readMetadata();
        const data = JSON.parse(await fs.readFile("./data.json", "utf-8"));
        assert.strictEqual(metadata.length, data.length);
        const len = metadata.length;
        for (let i = 0; i < len; i++) {
            const meta_i = metadata[i];
            const data_i = data[i];
            assert.strictEqual(meta_i.id, data_i.id);
            assert.strictEqual(meta_i.year, data_i.year);
            assert.strictEqual(meta_i.day, data_i.day);
            const out_data = JSON.parse(
                await fs.readFile(meta_i.outputFile, "utf-8")
            );
            assert.deepStrictEqual(out_data, data_i.output);
        }
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
