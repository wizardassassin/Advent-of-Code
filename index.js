import assert from "node:assert";
import yargs from "yargs";
import debugFile from "./debugFile.js";
import createFile from "./createFile.js";
import runAll, { validate } from "./runAll.js";
import { hideBin } from "yargs/helpers";
import { pruneMetadata, readMetadata, writeMetadata } from "./metadata.js";

function validateDate(year, day) {
    assert.strictEqual(Number.isFinite(year), true, "Invalid year number");
    assert.strictEqual(Number.isFinite(day), true, "Invalid day number");
}

yargs(hideBin(process.argv))
    .command(
        "debug <year> <day>",
        "Debug an AOC Day",
        (yargs) =>
            yargs
                .positional("year", {
                    type: "number",
                })
                .positional("day", {
                    type: "number",
                }),
        (argv) => {
            validateDate(argv.year, argv.day);
            debugFile(argv.year, argv.day);
        }
    )
    .command(
        "create <year> <day>",
        "Create Template Files",
        (yargs) =>
            yargs
                .positional("year", {
                    type: "number",
                })
                .positional("day", {
                    type: "number",
                }),
        (argv) => {
            validateDate(argv.year, argv.day);
            createFile(argv.year, argv.day);
        }
    )
    .command(
        "run",
        "Runs all Files",
        (yargs) => yargs,
        (argv) => {
            runAll();
        }
    )
    .command(
        "prune",
        "Prunes metadata file",
        (yargs) => yargs,
        (argv) => {
            const metadata = readMetadata();
            const pruned = pruneMetadata(metadata);
            pruned.removed.forEach((x) =>
                console.log(`Removed '${x.dayFolder}' entry`)
            );
            writeMetadata(pruned.filtered);
        }
    )
    .command(
        "validate",
        "Validates data.json file",
        (yargs) => yargs,
        (argv) => {
            validate();
        }
    )
    .strictCommands()
    .demandCommand()
    .parse();
