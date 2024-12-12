/**
 * --- Day 12: Garden Groups ---
 *
 * https://adventofcode.com/2024/day/12
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split("").map((x) => ({ value: x, visited: false })));

    const rows = arr.length;
    const cols = arr[0].length;

    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ];

    let sum = 0;
    const fieldData = [];
    let dataObj = { i: -1, j: -1, perm: [], area: -1 };
    const propagate = (i, j, value) => {
        const cell = arr?.[i]?.[j];
        if (!cell || cell.visited || cell.value !== value)
            return { area: 0, perm: 0 };
        cell.visited = true;
        const adj = directions.map(([a, b]) => [i + a, j + b]);
        const thePerm = adj
            .filter(([i2, j2]) => arr?.[i2]?.[j2]?.value !== cell.value)
            .map((x) => [...x]);
        if (thePerm.length !== 0) dataObj.perm.push({ i, j, perm: thePerm });
        const adjCount = adj.filter(
            ([i2, j2]) => arr?.[i2]?.[j2]?.value === cell.value
        ).length;
        let area = 1;
        let perm = 4 - adjCount;
        for (const adjCell of adj) {
            const res = propagate(...adjCell, value);
            area += res.area;
            perm += res.perm;
        }
        return { area, perm };
    };

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!arr[i][j].visited) {
                dataObj = { i: -1, j: -1, perm: [] };
                dataObj.i = i;
                dataObj.j = j;
                const res = propagate(i, j, arr[i][j].value);
                dataObj.area = res.area;
                fieldData.push(dataObj);
                sum += res.area * res.perm;
            }
        }
    }

    const partOne = sum;

    /** @type {{area: number, fieldData:[number, number, number, number, number][]}[]} */
    const fieldData2 = fieldData.map((x3) => ({
        entry: [x3.i, x3.j],
        area: x3.area,
        fieldData: x3.perm
            .map((x) =>
                x.perm.map((x2) => [
                    (x.i + x2[0]) / 2,
                    (x.j + x2[1]) / 2,
                    x.i,
                    x.j,
                ])
            )
            .flat(),
    }));

    const getSeqCount = (arr) => {
        if (arr.length === 0) return 0;
        let lineCount = 1;
        let prevOffset = arr[0][0] - 1;
        let prevLine = arr[0][1];
        for (let i = 0; i < arr.length; i++) {
            let curr = arr[i][0];
            let currLine = arr[i][1];
            if (prevOffset + 1 === curr && prevLine == currLine) {
                prevOffset = curr;
                prevLine = currLine;
                continue;
            }
            lineCount++;
            prevOffset = curr;
            prevLine = currLine;
        }
        return lineCount;
    };

    let sum2 = 0;
    for (const { fieldData, area } of fieldData2) {
        fieldData.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const horizontal = new Set(
            fieldData.map((x) => x[0]).filter((x) => !Number.isInteger(x))
        );
        const horizontal2 = [...horizontal].map((x) =>
            fieldData.filter((x2) => x2[0] === x).map((x2) => [x2[1], x2[2]])
        );
        const count1 = horizontal2.map(getSeqCount).reduce((a, b) => a + b, 0);
        fieldData.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
        const vertical = new Set(
            fieldData.map((x) => x[1]).filter((x) => !Number.isInteger(x))
        );
        const vertical2 = [...vertical].map((x) =>
            fieldData.filter((x2) => x2[1] === x).map((x2) => [x2[0], x2[3]])
        );
        const count2 = vertical2.map(getSeqCount).reduce((a, b) => a + b, 0);
        sum2 += (count1 + count2) * area;
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
