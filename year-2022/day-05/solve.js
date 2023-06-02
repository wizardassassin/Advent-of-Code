/**
 * --- Day 5: Supply Stacks ---
 *
 * https://adventofcode.com/2022/day/5
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const [image, directions] = input.split("\n\n");

    const board = {};
    const boardTemp = image.split("\n").map((x) => {
        const arr1 = [];
        for (let i = 1; i < x.length; i += 4) {
            arr1.push(x[i]);
        }
        return arr1;
    });
    const labels = boardTemp.splice(-1, 1)[0];

    for (const label of labels) {
        board[label] = boardTemp
            .map((x) => x.shift())
            .reverse()
            .filter((x) => x !== " ");
    }

    const board2 = structuredClone(board);

    const moves = directions.split("\n").map((x) => {
        const arr1 = x.split(" ");
        return [arr1[1], arr1[3], arr1[5]].map(Number);
    });

    for (const move of moves) {
        const fromArr = board[move[1]];
        const toArr = board[move[2]];
        const fromArr2 = board2[move[1]];
        const toArr2 = board2[move[2]];
        const count = move[0];
        const tempStore = [];
        for (let i = 0; i < count; i++) {
            toArr.push(fromArr.pop());
            tempStore.push(fromArr2.pop());
        }
        tempStore.reverse();
        toArr2.push(...tempStore);
    }

    const PartOne = labels.map((x) => board[x][board[x].length - 1]).join("");
    const PartTwo = labels.map((x) => board2[x][board2[x].length - 1]).join("");

    return { PartOne: PartOne, PartTwo: PartTwo };
}
