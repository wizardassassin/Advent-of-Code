/**
 * --- Day 2: Red-Nosed Reports ---
 *
 * https://adventofcode.com/2024/day/2
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(" ").map(Number));

    let sum = 0;

    for (const rep of arr) {
        const rep2 = new Set(rep);
        if (rep.length !== rep2.size) continue;
        const rep3 = rep.slice();
        const isInc = rep[1] - rep[0] > 0;
        if (isInc) {
            rep3.sort((a, b) => a - b);
        } else {
            rep3.sort((a, b) => b - a);
        }
        const allSame = rep.every((x, i) => x === rep3[i]);
        if (!allSame) continue;
        let isSafe = true;
        for (let i = 1; i < rep.length; i++) {
            if (Math.abs(rep[i] - rep[i - 1]) > 3) {
                isSafe = false;
                break;
            }
        }
        if (isSafe) sum++;
    }

    const partOne = sum;

    const isSafe = (rep) => {
        const rep2 = new Set(rep);
        if (rep.length !== rep2.size) return false;
        const rep3 = rep.slice();
        const isInc = rep[1] - rep[0] > 0;
        if (isInc) {
            rep3.sort((a, b) => a - b);
        } else {
            rep3.sort((a, b) => b - a);
        }
        const allSame = rep.every((x, i) => x === rep3[i]);
        if (!allSame) return false;
        for (let i = 1; i < rep.length; i++) {
            if (Math.abs(rep[i] - rep[i - 1]) > 3) return false;
        }
        return true;
    };

    let sum2 = 0;
    for (const rep of arr) {
        for (let i = 0; i < rep.length; i++) {
            const rep2 = rep.slice();
            rep2.splice(i, 1);
            if (isSafe(rep2)) {
                sum2++;
                break;
            }
        }
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
