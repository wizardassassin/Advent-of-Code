/**
 * --- Day 17: Pyroclastic Flow ---
 *
 * https://adventofcode.com/2022/day/17
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const windArr = input.split("").map((x) => {
        if (x === ">") {
            return { move: "right", translate: [0, 1] };
        }
        if (x === "<") {
            return { move: "left", translate: [0, -1] };
        }
    });
    const windCount = windArr.length;

    const rock_1 = {
        rock: [[".", ".", "#", "#", "#", "#", "."]].reverse().flat(),
        height: 1,
        coords: [
            [0, -1],
            [0, 0],
            [0, 1],
            [0, 2],
        ],
        left: [[0, -2]],
        right: [[0, 3]],
        down: [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [-1, 2],
        ],
    };

    const rock_2 = {
        rock: [
            [".", ".", ".", "#", ".", ".", "."],
            [".", ".", "#", "#", "#", ".", "."],
            [".", ".", ".", "#", ".", ".", "."],
        ]
            .reverse()
            .flat(),
        height: 3,
        coords: [
            [0, 0],
            [1, -1],
            [1, 0],
            [1, 1],
            [2, 0],
        ],
        left: [
            [0, -1],
            [1, -2],
            [2, -1],
        ],
        right: [
            [0, 1],
            [1, 2],
            [2, 1],
        ],
        down: [
            [0, -1],
            [-1, 0],
            [0, 1],
        ],
    };

    const rock_3 = {
        rock: [
            [".", ".", ".", ".", "#", ".", "."],
            [".", ".", ".", ".", "#", ".", "."],
            [".", ".", "#", "#", "#", ".", "."],
        ]
            .reverse()
            .flat(),
        height: 3,
        coords: [
            [0, -1],
            [0, 0],
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        left: [
            [0, -2],
            [1, 0],
            [2, 0],
        ],
        right: [
            [0, 2],
            [1, 2],
            [2, 2],
        ],
        down: [
            [-1, -1],
            [-1, 0],
            [-1, 1],
        ],
    };

    const rock_4 = {
        rock: [
            [".", ".", "#", ".", ".", ".", "."],
            [".", ".", "#", ".", ".", ".", "."],
            [".", ".", "#", ".", ".", ".", "."],
            [".", ".", "#", ".", ".", ".", "."],
        ]
            .reverse()
            .flat(),
        height: 4,
        coords: [
            [0, -1],
            [1, -1],
            [2, -1],
            [3, -1],
        ],
        left: [
            [0, -2],
            [1, -2],
            [2, -2],
            [3, -2],
        ],
        right: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
        ],
        down: [[-1, -1]],
    };

    const rock_5 = {
        rock: [
            [".", ".", "#", "#", ".", ".", "."],
            [".", ".", "#", "#", ".", ".", "."],
        ]
            .reverse()
            .flat(),
        height: 2,
        coords: [
            [0, -1],
            [0, 0],
            [1, -1],
            [1, 0],
        ],
        left: [
            [0, -2],
            [1, -2],
        ],
        right: [
            [0, 1],
            [1, 1],
        ],
        down: [
            [-1, -1],
            [-1, 0],
        ],
    };

    const rocks = [rock_1, rock_2, rock_3, rock_4, rock_5];
    const rockCount = rocks.length;

    const rock_sim = [];

    let rockIndex = 0;
    const placeRock = () => {
        const height = highestPoint(rock_sim);
        trimArr(rock_sim, height);
        const rock = rocks[rockIndex];
        padArr(rock_sim, 3 + rock.height);
        rockIndex = (rockIndex + 1) % rockCount;
        return { ...structuredClone(rock), center: [height + 3, 3] };
    };

    let windIndex = 0;
    /**
     *
     * @param {ReturnType<placeRock>} rock_m
     */
    const dropRock = (rock_m) => {
        let wind;
        const computeWind = () => {
            let canMove = true;
            for (const coord of rock_m[wind.move]) {
                if (rock_m.center[1] + coord[1] >= 7) {
                    canMove = false;
                    break;
                }
                if (rock_m.center[1] + coord[1] < 0) {
                    canMove = false;
                    break;
                }
                const coord2 = convertCoord(
                    rock_m.center[0] + coord[0],
                    rock_m.center[1] + coord[1]
                );
                if (rock_sim[coord2] !== ".") {
                    canMove = false;
                    break;
                }
            }
            if (canMove) {
                rock_m.center[1] += wind.translate[1];
            }
        };
        const moveDown = () => {
            for (const coord of rock_m.down) {
                const coord2 = convertCoord(
                    rock_m.center[0] + coord[0],
                    rock_m.center[1] + coord[1]
                );
                if (coord2 < 0) return false;
                if (rock_sim[coord2] !== ".") {
                    return false;
                }
            }
            rock_m.center[0]--;
            return true;
        };
        do {
            wind = windArr[windIndex];
            windIndex = (windIndex + 1) % windCount;
            computeWind();
        } while (moveDown());
    };

    const height = [];
    const dropCount = 2022;
    let prevHeight = 0;
    const computeDrop = () => {
        const rock_m = placeRock();
        dropRock(rock_m);
        showRock(rock_sim, rock_m.coords, rock_m.center);
        const dist = highestPoint(rock_sim);
        height.push(dist - prevHeight);
        prevHeight = dist;
    };
    for (let i = 0; i < dropCount; i++) {
        computeDrop();
    }

    const partOne = highestPoint(rock_sim);

    const dropCount2 = 5000;
    // extra iterations
    for (let i = dropCount; i < dropCount2; i++) {
        computeDrop();
    }

    const currHeight = highestPoint(rock_sim);

    // With such a high simulation count, there has to be
    // some kind of pattern to the rock height

    const startLen = 4;
    const pattern = height.slice(-startLen).reverse();
    let patternIndex = 0;
    let foundPattern = false;
    const tempPattern = [];
    for (let i = dropCount2 - 1 - startLen; i >= 0; i--) {
        if (tempPattern.length === pattern.length) {
            console.assert(pattern.every((x, i) => x === tempPattern[i]));
            foundPattern = true;
            break;
        }
        const num = height[i];
        if (num !== pattern[patternIndex]) {
            pattern.push(...tempPattern, num);
            patternIndex = 0;
            tempPattern.splice(0);
        } else {
            patternIndex++;
            tempPattern.push(num);
        }
    }

    pattern.reverse();

    console.assert(foundPattern);

    const patternLen = pattern.length;
    const patternSum = pattern.reduce((a, b) => a + b);

    const leftIterations = 1000000000000 - dropCount2;

    const sumCount = Math.floor(leftIterations / patternLen);
    const remainCount = leftIterations % patternLen;
    const remainSum = pattern.slice(0, remainCount).reduce((a, b) => a + b);

    const partTwo = currHeight + patternSum * sumCount + remainSum;

    return { partOne, partTwo };
}

function convertCoord(height, width) {
    return height * 7 + width;
}

function showRock(arr, coords, center) {
    for (const coord of coords) {
        const index = convertCoord(center[0] + coord[0], center[1] + coord[1]);
        console.assert(arr[index] === ".");
        arr[index] = "#";
    }
}

function trimArr(arr, height) {
    arr.splice(height * 7);
}

function padArr(arr, count) {
    const pad = [".", ".", ".", ".", ".", ".", "."];
    for (let i = 0; i < count; i++) {
        arr.push(...pad);
    }
}

function highestPoint(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const height = Math.floor(i / 7);
        if (arr[i] === "#") return height + 1;
    }
    return 0;
}

function printArr(arr) {
    console.log();
    const width = 7;
    for (let i = arr.length; i > 0; i -= width) {
        console.log(arr.slice(i - 7, i).join(""));
    }
    console.log();
}
