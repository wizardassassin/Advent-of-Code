/**
 * --- Day 1: Historian Hysteria ---
 *
 * https://adventofcode.com/2024/day/1
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(/ +/));

    const arr1 = [];
    const arr2 = [];

    for (const [v1, v2] of arr) {
        arr1.push(Number(v1));
        arr2.push(Number(v2));
    }

    arr1.sort();
    arr2.sort();

    let sum = 0;

    for (let i = 0; i < arr1.length; i++) {
        sum += Math.abs(arr1[i] - arr2[i]);
    }

    const partOne = sum;

    let sum2 = 0;

    const val = new Map();

    for (const v1 of arr2.map((x) => Number(x))) {
        if (val.has(v1)) {
            val.set(v1, val.get(v1) + 1);
            continue;
        }
        val.set(v1, 1);
    }

    for (let i = 0; i < arr1.length; i++) {
        sum2 += Number(arr1[i]) * (val.get(arr1[i]) ?? 0);
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
