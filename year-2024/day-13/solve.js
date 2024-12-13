/**
 * --- Day 13: Claw Contraption ---
 *
 * https://adventofcode.com/2024/day/13
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const a_cost = 3;
    const b_cost = 1;
    const arr = input.split("\n\n").map((x) => {
        const matches = x
            .match(/[+=]\d+/gm)
            .map((x) => x.slice(1))
            .map(Number);
        const obj = {
            a_x: matches[0],
            a_y: matches[1],
            b_x: matches[2],
            b_y: matches[3],
            p_x: matches[4],
            p_y: matches[5],
        };
        let minCost = Infinity;
        let min_b_count = -1;
        let min_a_count = -1;
        for (let b_count = 100; b_count >= 0; b_count--) {
            const remain_x = obj.p_x - obj.b_x * b_count;
            const remain_y = obj.p_y - obj.b_y * b_count;
            if (remain_x < 0 || remain_y < 0) continue;
            if (remain_x % obj.a_x !== 0 || remain_y % obj.a_y !== 0) continue;
            const a_count_x = remain_x / obj.a_x;
            const a_count_y = remain_y / obj.a_y;
            if (a_count_x !== a_count_y) continue;
            const cost = a_count_x * a_cost + b_count * b_cost;
            if (cost < minCost) {
                min_b_count = b_count;
                min_a_count = a_count_x;
                minCost = cost;
            }
        }
        return {
            obj,
            minCost,
            aCount: min_a_count,
            bCount: min_b_count,
            solvable: Number.isFinite(minCost),
        };
    });

    const partOne = arr
        .filter((x) => x.solvable)
        .map((x) => x.minCost)
        .reduce((a, b) => a + b, 0);

    const gcd = (a, b) => {
        while (b != 0) [a, b] = [b, a % b];
        return a;
    };

    const roundNum = (n, places = 2) =>
        Math.round(n * 10 ** places) / 10 ** places;

    // system of linear equations
    // floating point rounding error
    const arr2 = arr.map((x) => {
        const obj = x.obj;
        obj.p_x += 10000000000000;
        obj.p_y += 10000000000000;
        let b_count =
            (obj.p_y - (obj.a_y / obj.a_x) * obj.p_x) /
            (obj.b_y - (obj.a_y / obj.a_x) * obj.b_x);
        let a_count = (obj.p_x - obj.b_x * b_count) / obj.a_x;
        a_count = roundNum(a_count);
        b_count = roundNum(b_count);
        console.assert(Number.isFinite(a_count));
        console.assert(Number.isFinite(b_count));
        if (!Number.isInteger(b_count) || !Number.isInteger(a_count)) return 0;
        if (a_count < 0 || b_count < 0) return 0;
        return a_count * 3 + b_count;
    });

    const partTwo = arr2.reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
