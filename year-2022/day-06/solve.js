/**
 * --- Day 6: Tuning Trouble ---
 *
 * https://adventofcode.com/2022/day/6
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const len = input.length;
    let firstIndex = -1;
    for (let i = 0; i < len - 3; i++) {
        if (new Set(input.slice(i, i + 4)).size === 4) {
            firstIndex = i + 4;
            break;
        }
    }
    if (firstIndex === -1) {
        throw new Error("Index was not found.");
    }
    let secondIndex = -1;
    for (let i = firstIndex - 1; i < len - 13; i++) {
        if (new Set(input.slice(i, i + 14)).size === 14) {
            secondIndex = i + 14;
            break;
        }
    }
    if (secondIndex === -1) {
        throw new Error("Index was not found 2.");
    }

    const PartOne = firstIndex;
    const PartTwo = secondIndex;

    return { PartOne: PartOne, PartTwo: PartTwo };
}
