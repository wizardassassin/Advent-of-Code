/**
 * --- Day 10: Pipe Maze ---
 *
 * https://adventofcode.com/2023/day/10
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    // assert pipe length is even

    const rows = arr.length;
    const cols = arr[0].length;
    const offsets = {
        top: [-1, 0],
        right: [0, 1],
        bottom: [1, 0],
        left: [0, -1],
    };

    const getStartCoord = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (arr[i][j] === "S") return [i, j];
            }
        }
        throw new Error("No Starting Position");
    };

    const filterV = () => [offsets.top, offsets.bottom];
    const filterH = () => [offsets.left, offsets.right];
    const filterL = () => [offsets.top, offsets.right];
    const filterJ = () => [offsets.top, offsets.left];
    const filter7 = () => [offsets.left, offsets.bottom];
    const filterF = () => [offsets.right, offsets.bottom];
    const filterS = () => [
        offsets.top,
        offsets.right,
        offsets.bottom,
        offsets.left,
    ];

    const filters = new Map([
        ["|", filterV()],
        ["-", filterH()],
        ["L", filterL()],
        ["J", filterJ()],
        ["7", filter7()],
        ["F", filterF()],
        ["S", filterS()],
    ]);

    const sumArr = (a, b) => a.map((x, i) => x + b[i]);
    const arrEqual = (a, b) => a.every((x, i) => x == b[i]);
    const isZero = (a) => a.every((x) => x === 0);

    const isConnected = (a, b) => isZero(sumArr(a, b));

    const connectedPairs = new Set();

    // 7*7*4*4
    for (const [s_1, f_1] of [...filters.entries()]) {
        for (const [s_2, f_2] of [...filters.entries()]) {
            for (const o_1 of f_1) {
                for (const o_2 of f_2) {
                    if (isConnected(o_1, o_2)) {
                        connectedPairs.add(`${s_1}-${s_2}-${o_1[0]}-${o_1[1]}`);
                    }
                }
            }
        }
    }

    const getNextOffset = ([p_i, p_j]) => {
        const symbol = arr[p_i][p_j];
        const p_filter = filters.get(symbol);
        return p_filter.filter(([n_i, n_j]) => {
            const symbol2 = arr[p_i + n_i]?.[p_j + n_j];
            if (!symbol2) return false;
            return connectedPairs.has(`${symbol}-${symbol2}-${n_i}-${n_j}`);
        });
    };

    const startCoord = getStartCoord();

    let [line_1, line_2] = getNextOffset(startCoord);
    let [coord_1, coord_2] = [
        sumArr(startCoord, line_1),
        sumArr(startCoord, line_2),
    ];

    let pipeLen = 1;

    const arr2 = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ".")
    );

    const startSymbol = [...filters.entries()].find(
        ([s, f]) => f.includes(line_1) && f.includes(line_2)
    )[0];
    arr2[startCoord[0]][startCoord[1]] = startSymbol;
    arr2[coord_1[0]][coord_1[1]] = arr[coord_1[0]][coord_1[1]];
    arr2[coord_2[0]][coord_2[1]] = arr[coord_2[0]][coord_2[1]];

    while (!arrEqual(coord_1, coord_2)) {
        [line_1, line_2] = [
            getNextOffset(coord_1).filter((x) => !isConnected(x, line_1))[0],
            getNextOffset(coord_2).filter((x) => !isConnected(x, line_2))[0],
        ];
        [coord_1, coord_2] = [sumArr(coord_1, line_1), sumArr(coord_2, line_2)];
        arr2[coord_1[0]][coord_1[1]] = arr[coord_1[0]][coord_1[1]];
        arr2[coord_2[0]][coord_2[1]] = arr[coord_2[0]][coord_2[1]];
        pipeLen++;
    }

    const partOne = pipeLen;

    let enclosedCount = 0;

    let topOutside = true;
    let bottomOutside = true;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (arr2[i][j] === ".") {
                console.assert(topOutside === bottomOutside);
                if (!topOutside) enclosedCount++;
                continue;
            }
            if (arr2[i][j] === "|") {
                topOutside = !topOutside;
                bottomOutside = !bottomOutside;
                continue;
            }
            if (arr2[i][j] === "L") {
                topOutside = !topOutside;
                continue;
            }
            if (arr2[i][j] === "J") {
                topOutside = !topOutside;
                continue;
            }
            if (arr2[i][j] === "7") {
                bottomOutside = !bottomOutside;
                continue;
            }
            if (arr2[i][j] === "F") {
                bottomOutside = !bottomOutside;
                continue;
            }
        }
        console.assert(topOutside === bottomOutside);
        console.assert(topOutside === true);
    }

    const partTwo = enclosedCount;

    return { partOne, partTwo };
}
