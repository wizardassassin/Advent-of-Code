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

    const getNonIndex = (arr, i, step) => {
        while (i >= 0 && Number.isFinite(Number(arr[i]))) {
            i += step;
        }
        return i;
    };

    const getAdjacentValues = (i, j) =>
        checks.map(([a, b]) => [a + i, b + j]).map(([a, b]) => arr[a]?.[b]);

    const processAdjacentValues = (i, j) => {
        const adjacentValues = getAdjacentValues(i, j);

        if (adjacentValues.some((x) => x && x !== "." && !Number.isFinite(Number(x)))) {
            const i_1 = getNonIndex(arr[i], j, -1);
            const i_2 = getNonIndex(arr[i], j, 1);
            const num = arr[i].slice(i_1 + 1, i_2);

            for (const [a, b] of checks.map(([a, b]) => [a + i, b + j])) {
                const adjacentValue = arr[a]?.[b];

                if (adjacentValue && adjacentValue !== "." && !Number.isFinite(Number(adjacentValue))) {
                    const a_hash = `${a}-${b}`;
                    const val = ratios.has(a_hash) ? ratios.get(a_hash) : [];
                    val.push(Number(num.join("")));
                    ratios.set(a_hash, val);
                }
            }
            sum += Number(num.join(""));
        }
    };

    const ratios = new Map();
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (!Number.isFinite(Number(arr[i][j]))) continue;
            processAdjacentValues(i, j);
        }
    }

    let sum2 = 0;
    for (const b of ratios.values()) {
        if (b.length === 2) {
            sum2 += b[0] * b[1];
        }
    }

    const partOne = sum;
    const partTwo = sum2;

    return { partOne, partTwo };
}
