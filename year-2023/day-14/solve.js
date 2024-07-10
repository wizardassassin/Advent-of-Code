import fs from "fs";

/**
 * --- Day 14: Parabolic Reflector Dish ---
 *
 * https://adventofcode.com/2023/day/14
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const rows = arr.length;
    const cols = arr[0].length;

    const pushNorth = (arr2, j) => {
        let rockStack = 0;
        for (let i = rows - 1; i >= 0; i--) {
            if (arr2[i][j] === "O") {
                rockStack++;
                arr2[i][j] = ".";
            }
            if (arr2[i][j] === "#") {
                let t = 1;
                while (t <= rockStack) {
                    console.assert(arr2[i + t][j] === ".");
                    arr2[i + t][j] = "O";
                    t++;
                }
                rockStack = 0;
            }
        }
        let t = 1;
        while (t <= rockStack) {
            console.assert(arr2[-1 + t][j] === ".");
            arr2[-1 + t][j] = "O";
            t++;
        }
    };

    const pushSouth = (arr2, j) => {
        let rockStack = 0;
        for (let i = 0; i < rows; i++) {
            if (arr2[i][j] === "O") {
                rockStack++;
                arr2[i][j] = ".";
            }
            if (arr2[i][j] === "#") {
                let t = 1;
                while (t <= rockStack) {
                    console.assert(arr2[i - t][j] === ".");
                    arr2[i - t][j] = "O";
                    t++;
                }
                rockStack = 0;
            }
        }
        let t = 1;
        while (t <= rockStack) {
            console.assert(arr2[rows - t][j] === ".");
            arr2[rows - t][j] = "O";
            t++;
        }
    };

    const pushEast = (arr2, i) => {
        let rockStack = 0;
        for (let j = 0; j < rows; j++) {
            if (arr2[i][j] === "O") {
                rockStack++;
                arr2[i][j] = ".";
            }
            if (arr2[i][j] === "#") {
                let t = 1;
                while (t <= rockStack) {
                    console.assert(arr2[i][j - t] === ".");
                    arr2[i][j - t] = "O";
                    t++;
                }
                rockStack = 0;
            }
        }
        let t = 1;
        while (t <= rockStack) {
            console.assert(arr2[i][cols - t] === ".");
            arr2[i][cols - t] = "O";
            t++;
        }
    };

    const pushWest = (arr2, i) => {
        let rockStack = 0;
        for (let j = rows - 1; j >= 0; j--) {
            if (arr2[i][j] === "O") {
                rockStack++;
                arr2[i][j] = ".";
            }
            if (arr2[i][j] === "#") {
                let t = 1;
                while (t <= rockStack) {
                    console.assert(arr2[i][j + t] === ".");
                    arr2[i][j + t] = "O";
                    t++;
                }
                rockStack = 0;
            }
        }
        let t = 1;
        while (t <= rockStack) {
            console.assert(arr2[i][-1 + t] === ".");
            arr2[i][-1 + t] = "O";
            t++;
        }
    };

    for (let j = 0; j < cols; j++) {
        pushNorth(arr, j);
    }

    /**
     *
     * @param {string[]} arr2
     */
    const countRocks = (arr2) =>
        arr2.reduce((a, b) => a + Number(b === "O"), 0);
    /**
     *
     * @param {string[]} arr2
     */
    const calculateLoad = (arr2) =>
        arr2.reduce((a, b, i) => a + countRocks(b) * (rows - i), 0);

    const partOne = calculateLoad(arr);

    const pushCycle = (arr2) => {
        for (let j = 0; j < cols; j++) {
            pushNorth(arr2, j);
        }
        for (let i = 0; i < rows; i++) {
            pushWest(arr2, i);
        }
        for (let j = 0; j < cols; j++) {
            pushSouth(arr2, j);
        }
        for (let i = 0; i < rows; i++) {
            pushEast(arr2, i);
        }
    };

    for (let j = 0; j < cols; j++) {
        pushSouth(arr, j);
    }

    // assumption: there is a cycle somewhere

    const hist = [];

    for (let a = 0; a < 200; a++) {
        pushCycle(arr);
        hist.push(calculateLoad(arr));
    }

    const checkCycle = (len) => {
        const arr1 = hist.slice(-len);
        const arr2 = hist.slice(-len * 2, -len);
        return arr1.every((x, i) => x === arr2[i]);
    };

    const findCycle = () => {
        for (let a = 2; a < 20; a++) if (checkCycle(a)) return a;
        console.assert(false);
    };

    const cycleLength = findCycle();

    const remainCycles = (1000000000 - 200) % cycleLength;

    const partTwo = hist.at(-cycleLength - 1 + remainCycles);

    return { partOne, partTwo };
}
