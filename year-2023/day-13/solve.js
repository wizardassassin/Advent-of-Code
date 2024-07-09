/**
 * --- Day 13: Point of Incidence ---
 *
 * https://adventofcode.com/2023/day/13
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n\n")
        .map((x) => x.split("\n").map((x2) => x2.split("")));

    /**
     * a < b
     *
     * @param {string[][]} arr
     * @param {number} a
     * @param {number} b
     */
    const rowEquality = (arr, a, b) => {
        if (a < 0 || b >= arr.length) return true;
        for (let j = 0; j < arr[0].length; j++)
            if (arr[a][j] !== arr[b][j]) return false;
        return true;
    };

    /**
     * a < b
     *
     * @param {string[][]} arr
     * @param {number} a
     * @param {number} b
     */
    const colEquality = (arr, a, b) => {
        if (a < 0 || b >= arr[0].length) return true;
        for (let i = 0; i < arr.length; i++)
            if (arr[i][a] !== arr[i][b]) return false;
        return true;
    };

    /**
     *
     * @param {string[][]} arr
     * @param {number} index
     */
    const checkColReflection = (arr, index) => {
        let t1 = index - 1;
        let t2 = index;
        while (t1 >= 0 && t2 < arr[0].length) {
            if (!colEquality(arr, t1, t2)) return false;
            t1--;
            t2++;
        }
        return true;
    };
    /**
     *
     * @param {string[][]} arr
     * @param {boolean} keepChecking
     */
    const findColReflection = (arr, keepChecking = false) => {
        let index = 1;
        const res = [];
        while (index < arr[0].length) {
            if (checkColReflection(arr, index)) {
                if (!keepChecking) return [index];
                res.push(index);
            }
            index++;
        }
        return res.length !== 0 ? res : [-1];
    };

    /**
     *
     * @param {string[][]} arr
     * @param {number} index
     */
    const checkRowReflection = (arr, index) => {
        let t1 = index - 1;
        let t2 = index;
        while (t1 >= 0 && t2 < arr.length) {
            if (!rowEquality(arr, t1, t2)) return false;
            t1--;
            t2++;
        }
        return true;
    };
    /**
     *
     * @param {string[][]} arr
     * @param {boolean} keepChecking
     */
    const findRowReflection = (arr, keepChecking = false) => {
        let index = 1;
        const res = [];
        while (index < arr.length) {
            if (checkRowReflection(arr, index)) {
                if (!keepChecking) return [index];
                res.push(index);
            }
            index++;
        }
        return res.length !== 0 ? res : [-1];
    };

    let count = 0;

    const reflection = [];

    /**
     *
     * @param {string[][]} pattern
     * @param {number} prevRef
     */
    const getReflection = (pattern, prevRef = -1) => {
        const row = findRowReflection(pattern, prevRef !== -1);
        if (row.some((x) => x !== -1)) {
            const row2 = row.map((x) => 100 * x).find((x) => x !== prevRef);
            if (row2) return row2;
        }
        const col = findColReflection(pattern, prevRef !== -1);
        if (col.some((x) => x !== -1)) {
            const col2 = col.map((x) => 1 * x).find((x) => x !== prevRef);
            if (col2) return col2;
        }
        return -1;
    };

    for (const pattern of arr) {
        const ref = getReflection(pattern);
        console.assert(ref !== -1);
        reflection.push(ref);
        count += ref;
    }

    const partOne = count;

    let count2 = 0;

    const invertSymbol = (str) => (str === "." ? "#" : ".");

    /**
     *
     * @param {string[][]} pattern
     * @param {number} prevRef
     */
    const getNewReflection = (pattern, prevRef) => {
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[0].length; j++) {
                pattern[i][j] = invertSymbol(pattern[i][j]);
                const ref = getReflection(pattern, prevRef);
                pattern[i][j] = invertSymbol(pattern[i][j]);
                if (ref !== -1) return ref;
            }
        }
        console.assert(false);
    };

    for (let i = 0; i < arr.length; i++) {
        const pattern = arr[i];
        const prevRef = reflection[i];
        const newRef = getNewReflection(pattern, prevRef);
        count2 += newRef;
    }

    const partTwo = count2;

    return { partOne, partTwo };
}
