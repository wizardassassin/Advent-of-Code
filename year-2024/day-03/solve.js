/**
 * --- Day 3: Mull It Over ---
 *
 * https://adventofcode.com/2024/day/3
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    return { partOne: [...input.replace(/\n/g, "").matchAll(/mul\((\d+),(\d+)\)/g)].map((x) => x[1] * x[2]).reduce((a, b) => a + b, 0), partTwo: [1, ...input.replace(/\n/g, "").matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)].map((x, i, a) => i === 0 ? x : x[0][3] === "'" ? ((a[0] = 0), 0) : x[0][0] === "d" ? ((a[0] = 1), 0) : a[0] ? x[1] * x[2] : 0).slice(1).reduce((a, b) => a + b, 0) };
}
