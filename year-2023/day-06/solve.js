/**
 * --- Day 6: Wait For It ---
 *
 * https://adventofcode.com/2023/day/6
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split(/ +/).slice(1).map(Number));
    const arr2 = [];
    for (let i = 0; i < arr[0].length; i++) {
        arr2.push([arr[0][i], arr[1][i]]);
    }
    let sum = 1;
    for (const [time, distance] of arr2) {
        const min_x = 0.5 * (time - Math.sqrt(time ** 2 - 4 * distance));
        const max_x = 0.5 * (time + Math.sqrt(time ** 2 - 4 * distance));
        sum *= Math.floor(max_x) - Math.ceil(min_x) + 1;
    }

    let sum2 = 1;
    const time2 = Number(arr[0].join(""));
    const distance2 = Number(arr[1].join(""));
    const min_x = 0.5 * (time2 - Math.sqrt(time2 ** 2 - 4 * distance2));
    const max_x = 0.5 * (time2 + Math.sqrt(time2 ** 2 - 4 * distance2));
    sum2 *= Math.floor(max_x) - Math.ceil(min_x) + 1;

    const partOne = sum;
    const partTwo = sum2;

    return { partOne, partTwo };
}
