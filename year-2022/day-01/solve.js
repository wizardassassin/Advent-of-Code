/**
 * --- Day 1: Calorie Counting ---
 *
 * https://adventofcode.com/2022/day/1
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n\n").map((x) =>
        x
            .split("\n")
            .map(Number)
            .reduce((a, b) => a + b)
    );
    arr.sort((a, b) => b - a);
    const top3Sum = arr.slice(0, 3).reduce((a, b) => a + b);
    return { PartOne: Math.max(...arr), PartTwo: top3Sum };
}
