/**
 * --- Day 6: Lanternfish ---
 *
 * https://adventofcode.com/2021/day/6
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split(",").map(Number);

    let fishCount = Array.from({ length: 9 }, (_, i) =>
        arr.reduce((a, b) => (b == i ? ++a : a), 0)
    );

    const simulate = () => {
        const newFish = fishCount[0];
        fishCount = fishCount.slice(1).concat([newFish]);
        fishCount[6] += newFish;
    };

    for (let i = 0; i < 80; i++) {
        simulate();
    }

    const partOne = fishCount.reduce((a, b) => a + b, 0);

    for (let i = 80; i < 256; i++) {
        simulate();
    }

    const partTwo = fishCount.reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
