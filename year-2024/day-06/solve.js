/**
 * --- Day 6: Guard Gallivant ---
 *
 * https://adventofcode.com/2024/day/6
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    let arr = input.split("\n").map((x) => x.split(""));
    const arrBase = [...arr].map((x) => [...x]);

    const findChar = (v) => {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                if (arr[i][j] === v) return [i, j];
            }
        }
    };

    const countChar = (v) => {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                if (arr[i][j] === v) count++;
            }
        }
        return count;
    };

    const inBounds = (i, j) =>
        i >= 0 && i < arr.length && j >= 0 && j < arr[0].length;

    let dirIndex = 0;
    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ];

    let guardCoord = findChar("^");
    let guardCoordInitial = [...guardCoord];

    while (inBounds(guardCoord[0], guardCoord[1])) {
        arr[guardCoord[0]][guardCoord[1]] = "X";
        if (
            arr?.[guardCoord[0] + directions[dirIndex][0]]?.[
                guardCoord[1] + directions[dirIndex][1]
            ] === "#"
        ) {
            dirIndex = (dirIndex + 1) % directions.length;
        }
        guardCoord[0] += directions[dirIndex][0];
        guardCoord[1] += directions[dirIndex][1];
    }

    const partOne = countChar("X");

    const locations = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (
                arr[i][j] === "X" &&
                !(i === guardCoordInitial[0] && j === guardCoordInitial[1])
            ) {
                locations.push([i, j]);
            }
        }
    }

    let sum2 = 0;

    const willLoop = () => {
        let dirIndex = 0;
        const prevPos = new Set();
        guardCoord = [...guardCoordInitial];
        while (inBounds(guardCoord[0], guardCoord[1])) {
            while (
                arr?.[guardCoord[0] + directions[dirIndex][0]]?.[
                    guardCoord[1] + directions[dirIndex][1]
                ] === "#"
            ) {
                dirIndex = (dirIndex + 1) % directions.length;
            }
            const key = `${guardCoord[0]}-${guardCoord[1]}-${dirIndex}`;
            if (prevPos.has(key)) {
                return true;
            }
            prevPos.add(key);
            guardCoord[0] += directions[dirIndex][0];
            guardCoord[1] += directions[dirIndex][1];
        }
        return false;
    };

    for (const location of locations) {
        arr = [...arrBase].map((x) => [...x]); // structuredClone is slow
        arr[location[0]][location[1]] = "#";
        if (willLoop()) sum2++;
    }
    const partTwo = sum2;

    return { partOne, partTwo };
}
