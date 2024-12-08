/**
 * --- Day 8: Bridge Repair ---
 *
 * https://adventofcode.com/2024/day/8
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const points = new Map();
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            const coord = [i, j];
            const val = arr[i][j];
            if (val === ".") continue;
            if (!points.has(val)) points.set(val, []);
            points.get(val).push(coord);
        }
    }
    const locations = new Set();

    const getDistance = (coord1, coord2) => [
        coord2[0] - coord1[0],
        coord2[1] - coord1[1],
    ];

    const antidoteInfo = [];
    for (const [key, value] of points.entries()) {
        for (let i = 0; i < value.length; i++) {
            for (let j = i + 1; j < value.length; j++) {
                const val1 = value[i];
                const val2 = value[j];
                const dist = getDistance(val1, val2);
                antidoteInfo.push([val1, dist]);
                locations.add(`${val1[0] - dist[0]},${val1[1] - dist[1]}`);
                locations.add(`${val2[0] + dist[0]},${val2[1] + dist[1]}`);
            }
        }
    }
    const inBounds = (i, j) =>
        i >= 0 && i < arr.length && j >= 0 && j < arr[0].length;

    const locations2 = [...locations]
        .map((x) => x.split(","))
        .filter((x) => inBounds(x[0], x[1]));

    const partOne = locations2.length;
    const addPoint = (i, j) => locations.add(`${i},${j}`);

    for (const [start, diff] of antidoteInfo) {
        let start2 = [...start];
        while (inBounds(...start2)) {
            addPoint(...start2);
            start2[0] -= diff[0];
            start2[1] -= diff[1];
        }
        start2 = [...start];
        while (inBounds(...start2)) {
            addPoint(...start2);
            start2[0] += diff[0];
            start2[1] += diff[1];
        }
    }

    const partTwo = [...locations]
        .map((x) => x.split(","))
        .filter((x) => inBounds(x[0], x[1])).length;

    return { partOne, partTwo };
}
