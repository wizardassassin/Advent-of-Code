/**
 * --- Day 9: Mirage Maintenance ---
 *
 * https://adventofcode.com/2023/day/9
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(" ").map(Number));

    /**
     *
     * @param {number[]} arr1
     * @returns
     */
    const genNextSeq = (arr1) =>
        arr1.slice(1).map((x, i, a) => (i !== 0 ? x - a[i - 1] : x - arr1[0]));

    /**
     *
     * @param {number[]} arr1
     * @returns
     */
    const allZero = (arr1) => arr1.every((x) => x === 0);

    const arr2 = arr.map((x) => {
        const storage = [x];
        let arr3 = x;
        do {
            arr3 = genNextSeq(arr3);
            storage.push(arr3);
        } while (!allZero(arr3));
        return storage.reverse();
    });

    let sum1 = 0;
    for (const arr3 of arr2) {
        arr3[0].push(0);
        for (let i = 1; i < arr3.length; i++) {
            arr3[i].push(arr3[i].at(-1) + arr3[i - 1].at(-1));
        }
        sum1 += arr3.at(-1).at(-1);
    }

    const partOne = sum1;

    let sum2 = 0;
    for (const arr3 of arr2) {
        arr3[0].unshift(0);
        for (let i = 1; i < arr3.length; i++) {
            arr3[i].unshift(arr3[i].at(0) - arr3[i - 1].at(0));
        }
        sum2 += arr3.at(-1).at(0);
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
