/**
 * --- Day 2: Gift Shop ---
 *
 * https://adventofcode.com/2025/day/2
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split(",").map((x) => {
        const [start, stop] = x.split("-").map(Number);
        return { start, stop };
    });

    let invalidCount = 0;
    for (const { start, stop } of arr) {
        for (let i = start; i <= stop; i++) {
            const id = String(i);
            if (id.length % 2 !== 0) continue;
            const mid = id.length / 2;
            if (id.slice(0, mid) === id.slice(mid)) invalidCount += i;
        }
    }

    const partOne = invalidCount;

    let invalidCount2 = 0;

    for (const { start, stop } of arr) {
        for (let i = start; i <= stop; i++) {
            const id = String(i);
            if (isInvalid(id)) {
                invalidCount2 += i;
            }
        }
    }

    const partTwo = invalidCount2;

    return { partOne, partTwo };
}

/**
 *
 * @param {string} id
 */
function isInvalid(id) {
    // i can be prime
    for (let i = 1; i <= id.length / 2; i++) {
        if (id.length % i !== 0) continue;
        let testSubsequence = id.slice(0, i);
        let isInvalid = true;
        for (let j = 0; j < id.length - i + 1; j += i) {
            if (testSubsequence !== id.slice(j, j + i)) {
                isInvalid = false;
                break;
            }
        }
        if (isInvalid) return true;
    }

    return false;
}
