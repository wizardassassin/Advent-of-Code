/**
 * --- Day 10: Hoof It ---
 *
 * https://adventofcode.com/2024/day/10
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split("").map(Number));

    const rows = arr.length;
    const cols = arr[0].length;

    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ];

    function* getStartingPoints() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (arr[i][j] === 0) yield [i, j];
            }
        }
    }

    const inBounds = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;

    const getScore = ([i, j]) => {
        const val = arr[i][j];
        if (val === 9) return [`${i},${j}`];
        return directions
            .map(([i2, j2]) => [i + i2, j + j2])
            .filter(([i2, j2]) => val + 1 === arr?.[i2]?.[j2])
            .map(getScore)
            .map((x) => [...x])
            .flat();
    };

    const scores = [...getStartingPoints()].map(getScore);

    const partOne = scores
        .map((x) => new Set(x).size)
        .reduce((a, b) => a + b, 0);
    const partTwo = scores.map((x) => x.length).reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
