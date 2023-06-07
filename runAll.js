import { readMetadata, sortMetadata } from "./metadata.js";
import { debugFile2 } from "./debugFile.js";
import fs from "fs/promises";

export default async function runAll() {
    const store = [];
    const metadata = readMetadata();
    sortMetadata(metadata);
    for (const data of metadata) {
        const res = await debugFile2(data);
        store.push(structuredClone(res));
        res.duration = res.duration.toFixed(4) + "ms";
        console.log(res);
    }
    await fs.writeFile("./data.json", JSON.stringify(store, null, 4));
}
