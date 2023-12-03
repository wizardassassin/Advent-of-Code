/**
 * --- Day 3: Gear Ratios ---
 *
 * https://adventofcode.com/2023/day/3
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const checks = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
    ];

    const getNonIndex = (arr, i) => {
        while (i >= 0 && Number.isFinite(Number(arr[i]))) {
            i--;
        }
        return i;
    };

    const getNonIndex2 = (arr, i) => {
        while (i < arr.length && Number.isFinite(Number(arr[i]))) {
            i++;
        }
        return i;
    };

    const ratios = new Map();
    const hash = (i, j) => "" + i + "-" + j;

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (!Number.isFinite(Number(arr[i][j]))) continue;
            if (
                checks
                    .map(([a, b]) => [a + i, b + j])
                    .map(([a, b]) => arr[a]?.[b])
                    .some((x) => x && x !== "." && !Number.isFinite(Number(x)))
            ) {
                const A = checks.map(([a, b]) => [a + i, b + j]);
                const B = A.map(([a, b]) => arr[a]?.[b]);
                const C = B.map(
                    (x) => x && x !== "." && !Number.isFinite(Number(x))
                );
                const i_1 = getNonIndex(arr[i], j);
                const i_2 = getNonIndex2(arr[i], j);
                const num = arr[i].slice(i_1 + 1, i_2);
                j = i_2 - 1;
                for (let d = 0; d < A.length; d++) {
                    if (C[d]) {
                        const a_hash = hash(A[d][0], A[d][1]);
                        let val;
                        if (!ratios.has(a_hash)) {
                            val = [];
                            ratios.set(a_hash, val);
                        } else {
                            val = ratios.get(a_hash);
                        }
                        val.push(Number(num.join("")));
                    }
                }
                sum += Number(num.join(""));
            }
        }
    }

    let sum2 = 0;
    for (const [a, b] of ratios) {
        if (b.length == 2) {
            sum2 += b[0] * b[1];
        }
    }

    const partOne = sum;
    const partTwo = sum2;

    return { partOne, partTwo };
}
