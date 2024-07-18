/**
 * --- Day 15: Lens Library ---
 *
 * https://adventofcode.com/2023/day/15
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split(",");
    /**
     *
     * @param {string} str
     * @returns
     */
    const getHash = (str) =>
        str
            .split("")
            .map((x) => x.charCodeAt())
            .reduce((a, b) => ((a + b) * 17) % 256, 0);

    const partOne = arr.map((x) => getHash(x)).reduce((a, b) => a + b);

    /** @type {{label: string; focal: number;}[][]} */
    const boxes = Array.from({ length: 256 }, () => []);
    for (const inst of arr) {
        const [label, num] = inst.split(/-|=/);
        const boxIndex = getHash(label);
        const box = boxes[boxIndex];
        if (inst.at(-1) !== "-") {
            // add
            const lensIndex = box.findIndex((x) => x.label === label);
            if (lensIndex === -1) {
                box.push({ label: label, focal: Number(num) });
                continue;
            }
            box[lensIndex].focal = Number(num);
            continue;
        }
        // subtract
        const lensIndex = box.findIndex((x) => x.label === label);
        if (lensIndex === -1) continue;
        box.splice(lensIndex, 1);
    }

    const partTwo = boxes
        .map(
            (x, i) =>
                (i + 1) *
                x
                    .map((x2, i2) => x2.focal * (i2 + 1))
                    .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
