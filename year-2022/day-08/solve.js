/**
 * --- Day 8: Treetop Tree House ---
 *
 * https://adventofcode.com/2022/day/8
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split("").map(Number));

    const rows = arr.length;
    const cols = arr[0].length;

    console.assert(rows === cols);

    const treeCoords = new Set();

    const inForest = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;

    const addTrees = (start_i, start_j, move_i, move_j) => {
        let highestTree = -Infinity;
        do {
            const tree = arr[start_i][start_j];
            if (tree > highestTree) {
                treeCoords.add(`${start_i}-${start_j}`);
            }
            highestTree = Math.max(highestTree, tree);
            start_i += move_i;
            start_j += move_j;
        } while (inForest(start_i, start_j) && highestTree < 9);
    };

    for (let i = 0; i < rows; i++) {
        addTrees(i, 0, 0, 1);
        addTrees(0, i, 1, 0);
        addTrees(i, rows - 1, 0, -1);
        addTrees(rows - 1, i, -1, 0);
    }

    const partOne = treeCoords.size;

    const getScore = (start_i, start_j, move_i, move_j) => {
        const treeHeight = arr[start_i][start_j];
        start_i += move_i;
        start_j += move_j;
        let treeCount = 0;
        while (inForest(start_i, start_j)) {
            const tree = arr[start_i][start_j];
            treeCount++;
            if (tree >= treeHeight) {
                break;
            }
            start_i += move_i;
            start_j += move_j;
        }
        return treeCount;
    };

    const computeScore = (i, j) => {
        return (
            getScore(i, j, 0, 1) *
            getScore(i, j, 1, 0) *
            getScore(i, j, 0, -1) *
            getScore(i, j, -1, 0)
        );
    };

    let bestScore = -Infinity;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const score = computeScore(i, j);
            bestScore = Math.max(bestScore, score);
        }
    }

    const partTwo = bestScore;

    return { partOne, partTwo };
}
