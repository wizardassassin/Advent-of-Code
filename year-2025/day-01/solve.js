/**
 * --- Day 1: Secret Entrance ---
 *
 * https://adventofcode.com/2025/day/1
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => (x[0] === "L" ? -Number(x.slice(1)) : Number(x.slice(1))));

    let dialNum = 50;
    let numOptions = 100;
    let count = 0;
    let count2 = 0;

    for (const num of arr) {
        let temp;
        count2 += Math.floor(Math.abs((temp = dialNum + num) / numOptions));
        if (temp <= 0 && dialNum > 0) count2++;
        dialNum = (((dialNum + num) % numOptions) + numOptions) % numOptions;
        if (dialNum === 0) count++;
    }

    const partOne = count;
    const partTwo = count2;

    return { partOne, partTwo };
}
