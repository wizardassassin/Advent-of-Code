/**
 * --- Day 4: Ceres Search ---
 *
 * https://adventofcode.com/2024/day/4
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1],
    ];

    let sum = 0;

    const hasWord = (i, j, word, direction) => {
        for (const letter of word) {
            if (arr?.[i]?.[j] !== letter) return false;
            i += direction[0];
            j += direction[1];
        }
        return true;
    };

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            for (const direction of directions) {
                if (hasWord(i, j, "XMAS", direction)) sum++;
            }
        }
    }

    const partOne = sum;

    let sum2 = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (
                (hasWord(i + 1, j + 1, "MAS", [-1, -1]) ||
                    hasWord(i + 1, j + 1, "SAM", [-1, -1])) &&
                (hasWord(i + 1, j - 1, "MAS", [-1, 1]) ||
                    hasWord(i + 1, j - 1, "SAM", [-1, 1]))
            )
                sum2++;
        }
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
