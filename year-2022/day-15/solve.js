/**
 * --- Day 15: Beacon Exclusion Zone ---
 *
 * https://adventofcode.com/2022/day/15
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const getManhattanDistance = (coord1, coord2) =>
        Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);

    const equalCoords = (coord1, coord2) =>
        coord1[0] === coord2[0] && coord1[1] === coord2[1];

    const arr = input.split("\n").map((x) => {
        const index2 = x.indexOf(",");
        const index4 = x.indexOf(":");
        const index6 = x.indexOf(",", index4);
        const firstNumber = Number(x.slice(x.indexOf("=") + 1, index2));
        const secondNumber = Number(
            x.slice(x.indexOf("=", index2) + 1, index4)
        );
        const thirdNumber = Number(x.slice(x.indexOf("=", index4) + 1, index6));
        const fourthNumber = Number(x.slice(x.indexOf("=", index6) + 1));
        const sensor = [firstNumber, secondNumber];
        const beacon = [thirdNumber, fourthNumber];
        return {
            sensor,
            beacon,
            distance: getManhattanDistance(sensor, beacon),
        };
    });

    const maxDistance = arr.map((x) => x.distance).reduce((a, b) => a + b);

    const bounds = arr.reduce(
        (a, b) => {
            a[0][0] = Math.min(a[0][0], b.beacon[0] - maxDistance);
            a[0][1] = Math.max(a[0][0], b.beacon[0] + maxDistance);
            a[1][0] = Math.min(a[1][0], b.beacon[1] - maxDistance);
            a[1][1] = Math.max(a[1][0], b.beacon[1] + maxDistance);
            return a;
        },
        [
            [Infinity, -Infinity],
            [Infinity, -Infinity],
        ]
    );

    let empties = 0;
    for (let i = bounds[0][0]; i <= bounds[0][1]; i++) {
        let j = 2000000;
        // let j = 10;
        const tempCoord = [i, j];
        let noOverlap = true;
        for (const { sensor, beacon, distance } of arr) {
            if (
                !equalCoords(tempCoord, sensor) &&
                !equalCoords(tempCoord, beacon) &&
                getManhattanDistance(tempCoord, sensor) <= distance
            ) {
                noOverlap = false;
                break;
            }
        }
        if (!noOverlap) {
            empties++;
        }
    }

    const outCoord = [0, 0];
    const bound = 4000000;
    // const bound = 20;
    let foundBeacon = false;
    for (let i = 0; i <= bound; i++) {
        for (let j = 0; j <= bound; j++) {
            let isBeacon = true;
            for (const { sensor, beacon, distance } of arr) {
                if (getManhattanDistance([i, j], sensor) <= distance) {
                    j += sensor[1] - j + (distance - Math.abs(sensor[0] - i));
                    isBeacon = false;
                    break;
                }
            }
            if (isBeacon) {
                if (foundBeacon) {
                    console.error("Duplicate Beacons");
                    console.error(outCoord);
                    console.error([i, j]);
                }
                outCoord[0] = i;
                outCoord[1] = j;
                foundBeacon = true;
            }
        }
    }

    const PartOne = empties;
    const PartTwo = outCoord[0] * 4000000 + outCoord[1];

    return { partOne: PartOne, partTwo: PartTwo };
}
