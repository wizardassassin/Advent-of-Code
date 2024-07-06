/**
 * --- Day 11: Cosmic Expansion ---
 *
 * https://adventofcode.com/2023/day/11
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const rows = arr.length;
    const cols = arr[0].length;

    const galaxies = [];
    const emptyRows = [];
    const emptyCols = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (arr[i][j] === "#") galaxies.push([i, j]);
        }
    }
    for (let i = 0; i < rows; i++) {
        let isEmpty = true;
        for (let j = 0; j < cols; j++) {
            if (arr[i][j] === "#") isEmpty = false;
        }
        if (isEmpty) emptyRows.push(i);
    }
    for (let j = 0; j < cols; j++) {
        let isEmpty = true;
        for (let i = 0; i < rows; i++) {
            if (arr[i][j] === "#") isEmpty = false;
        }
        if (isEmpty) emptyCols.push(j);
    }

    /**
     *
     * @param {number} expand_size
     * @returns distance
     */
    const getDistance = (expand_size) => {
        /** @type {[number, number][]} */
        const galaxies1 = structuredClone(galaxies);
        const galaxies2 = [...galaxies1];
        galaxies2.sort((a, b) => a[1] - b[1]);

        let r_i = 0;
        let g1_i = 0;
        while (r_i < emptyRows.length && g1_i < galaxies1.length) {
            if (emptyRows[r_i] < galaxies1[g1_i][0]) {
                r_i++;
            } else {
                galaxies1[g1_i][0] += r_i * (expand_size - 1);
                g1_i++;
            }
        }
        while (g1_i < galaxies1.length) {
            galaxies1[g1_i][0] += r_i * (expand_size - 1);
            g1_i++;
        }

        let c_i = 0;
        let g2_i = 0;
        while (c_i < emptyCols.length && g2_i < galaxies2.length) {
            if (emptyCols[c_i] < galaxies2[g2_i][1]) {
                c_i++;
            } else {
                galaxies2[g2_i][1] += c_i * (expand_size - 1);
                g2_i++;
            }
        }
        while (g2_i < galaxies2.length) {
            galaxies2[g2_i][1] += c_i * (expand_size - 1);
            g2_i++;
        }

        let distance = 0;

        for (let i = 0; i < galaxies1.length; i++) {
            for (let j = i + 1; j < galaxies1.length; j++) {
                distance +=
                    Math.abs(galaxies1[i][0] - galaxies1[j][0]) +
                    Math.abs(galaxies1[i][1] - galaxies1[j][1]);
            }
        }
        return distance;
    };

    const partOne = getDistance(2);
    const partTwo = getDistance(1000000);

    return { partOne, partTwo };
}
