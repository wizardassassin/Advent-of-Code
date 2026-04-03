/**
 * --- Day 4: Printing Department ---
 *
 * https://adventofcode.com/2025/day/4
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const isValid = (i, j) =>
        i >= 0 && i < arr.length && j >= 0 && j < arr[0].length;

    const canBeAccessed = (i, j) => {
        const offsets = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];
        const adjRolls = offsets
            .map((x) => [i + x[0], j + x[1]])
            .filter((x) => isValid(x[0], x[1]))
            .filter((x) => arr[x[0]][x[1]] === "@").length;
        return adjRolls < 4;
    };

    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (arr[i][j] === ".") continue;
            if (canBeAccessed(i, j)) counter++;
        }
    }

    const partOne = counter;

    let removedRolls = 0;
    let didRemoveRoll = true;
    while (didRemoveRoll) {
        didRemoveRoll = false;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                if (arr[i][j] === ".") continue;
                if (canBeAccessed(i, j)) {
                    arr[i][j] = ".";
                    removedRolls++;
                    didRemoveRoll = true;
                }
            }
        }
    }

    const partTwo = removedRolls;

    return { partOne, partTwo };
}
