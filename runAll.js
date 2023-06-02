import { readMetadata, sortMetadata } from "./metadata.js";
import { debugFile2 } from "./debugFile.js";
import fs from "fs/promises";

export default async function runAll() {
    const store = [];
    const metadata = readMetadata();
    sortMetadata(metadata);
    for (const data of metadata) {
        const res = await debugFile2(data);
        store.push({
            year: res.year,
            day: res.day,
            duration: Number(res.duration.slice(0, -2)),
        });
        console.log(res);
    }
    await fs.writeFile("./data.json", JSON.stringify(store, null, 4));
}
