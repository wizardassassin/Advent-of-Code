/**
 * --- Day 3: Mull It Over ---
 *
 * https://adventofcode.com/2024/day/3
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const data = input.replace(/\n/g, "");

    const res = data.matchAll(/mul\((\d+),(\d+)\)/g);

    const sum1 = [...res]
        .map((x) => Number(x[1]) * Number(x[2]))
        .reduce((a, b) => a + b, 0);

    const partOne = sum1;

    const res2 = data.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g);

    let sum2 = 0;
    let calcMul = true;
    for (const res3 of res2) {
        if (res3[0].startsWith("do()")) {
            calcMul = true;
            continue;
        }
        if (res3[0].startsWith("don't()")) {
            calcMul = false;
            continue;
        }
        if (calcMul) {
            sum2 += Number(res3[1]) * Number(res3[2]);
        }
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
