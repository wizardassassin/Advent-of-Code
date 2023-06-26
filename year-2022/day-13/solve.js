/**
 * --- Day 13: Distress Signal ---
 *
 * https://adventofcode.com/2022/day/13
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n\n")
        .map((x) => x.split("\n").map((x2) => JSON.parse(x2)));

    const inOrder = (left, right) => {
        if (typeof left === "number" && typeof right === "number") {
            return left - right;
        }
        if (Array.isArray(left) && Array.isArray(right)) {
            let i = 0;
            const len = Math.min(left.length, right.length);
            while (i < len) {
                const isInOrder = inOrder(left[i], right[i]);
                if (isInOrder !== 0) return isInOrder;
                i++;
            }
            return left.length - right.length;
        }
        if (typeof left === "number" && Array.isArray(right)) {
            return inOrder([left], right);
        }
        if (Array.isArray(left) && typeof right === "number") {
            return inOrder(left, [right]);
        }
        console.error(left, right);
        throw new Error("Unexpected parameters");
    };

    const indexArr = [];

    let index = 1;
    for (const [left, right] of arr) {
        const isInOrder = inOrder(left, right);
        if (isInOrder < 0) indexArr.push(index);
        index++;
    }

    const partOne = indexArr.reduce((a, b) => a + b);

    const dividerOne = [[2]];
    const dividerTwo = [[6]];

    const packets = [...arr.flat(), dividerOne, dividerTwo];

    packets.sort((a, b) => inOrder(a, b));

    const indexOne = packets.findIndex((x) => x === dividerOne) + 1;
    const indexTwo = packets.findIndex((x) => x === dividerTwo) + 1;

    const partTwo = indexOne * indexTwo;

    return { partOne, partTwo };
}
