/**
 * --- Day 4: Camp Cleanup ---
 *
 * https://adventofcode.com/2022/day/4
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split(",").map((x2) => x2.split("-").map(Number)));

    const encapsulates = arr.filter(
        ([a, b]) =>
            a[0] - b[0] === 0 ||
            a[1] - b[1] === 0 ||
            Math.sign(a[0] - b[0]) !== Math.sign(a[1] - b[1])
    );
    const encapsulates2 = arr.filter(
        ([a, b]) =>
            a[0] - b[0] === 0 ||
            a[1] - b[1] === 0 ||
            Math.sign(a[0] - b[0]) !== Math.sign(a[1] - b[1]) ||
            !(
                Math.sign(a[0] - b[0]) === Math.sign(a[0] - b[1]) &&
                Math.sign(a[1] - b[0]) === Math.sign(a[1] - b[1])
            )
    );

    const PartOne = encapsulates.length;
    const PartTwo = encapsulates2.length;

    return { partOne: PartOne, partTwo: PartTwo };
}
