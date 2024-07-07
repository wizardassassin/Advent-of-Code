/**
 * --- Day 12: Hot Springs ---
 *
 * https://adventofcode.com/2023/day/12
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split(" "))
        .map((x) => [x[0].split(""), x[1].split(",").map((x2) => Number(x2))]);

    const cache = new Map();
    let useCache = false;

    /**
     *
     * @param {string[]} spring
     * @param {number[]} damaged
     * @param {number} i
     * @param {number} j
     */
    function countArrangements(spring, damaged, i = 0, j = 0) {
        if (cache.has(`${i}-${j}`)) return cache.get(`${i}-${j}`);
        if (i >= spring.length && j === damaged.length) return 1;
        if (i >= spring.length) return 0;
        if (j === damaged.length)
            return spring.slice(i).every((x) => x !== "#");
        if (i + damaged[j] > spring.length) return 0;
        const canPlace =
            spring.slice(i, i + damaged[j]).every((x) => x !== ".") &&
            spring[i + damaged[j]] !== "#";
        const a = canPlace
            ? countArrangements(spring, damaged, i + damaged[j] + 1, j + 1)
            : 0;
        const canSkip = spring[i] !== "#";
        const b = canSkip ? countArrangements(spring, damaged, i + 1, j) : 0;
        cache.set(`${i}-${j}`, a + b);
        return a + b;
    }

    let count1 = 0;

    for (const [spring, damaged] of arr) {
        cache.clear();
        const a = countArrangements(spring, damaged);
        count1 += a;
    }

    const partOne = count1;

    let count2 = 0;

    for (const [spring, damaged] of arr) {
        cache.clear();
        const a = countArrangements(
            [
                ...spring,
                "?",
                ...spring,
                "?",
                ...spring,
                "?",
                ...spring,
                "?",
                ...spring,
            ],
            [...damaged, ...damaged, ...damaged, ...damaged, ...damaged]
        );
        count2 += a;
    }
    const partTwo = count2;

    return { partOne, partTwo };
}

// /**
//  *
//  * @param {string[]} spring
//  * @param {number[]} damaged
//  */
// function countArrangements(spring, damaged) {
//     if (spring.length === 0 && damaged.length === 0) return 1;
//     if (damaged.length === 0) {
//         if (hasDamaged(spring)) return 0;
//         return 1;
//     }
//     if (spring.length === 0) return 0;
//     let count2 = 0;
//     for (let i = 0; i < spring.length - damaged[0] + 1; i++) {
//         if (canPlace(spring.slice(i), damaged[0])) {
//             count2 += countArrangements(
//                 spring.slice(i + damaged[0] + 1),
//                 damaged.slice(1)
//             );
//             if (haveToPlace(spring.slice(i), damaged[0])) break;
//         }
//     }
//     return count2;
// }
