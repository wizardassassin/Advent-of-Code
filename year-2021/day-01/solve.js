/**
 * --- Day 1: Sonar Sweep ---
 *
 * https://adventofcode.com/2021/day/1
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => Number(x));

    let sum1 = 0;

    for (let i = 1; i < arr.length; i++) if (arr[i] - arr[i - 1] > 0) sum1++;

    const partOne = sum1;

    let sum2 = 0;

    for (let i = 3; i < arr.length; i++) if (arr[i] - arr[i - 3] > 0) sum2++;

    const partTwo = sum2;

    return { partOne, partTwo };
}
