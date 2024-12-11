/**
 * --- Day 11: Plutonian Pebbles ---
 *
 * https://adventofcode.com/2024/day/11
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split(" ").map((x) => ({ value: x, count: 1 }));

    let stones = [...arr];

    const blink = (stones) => {
        const stones2 = [];
        for (let i = 0; i < stones.length; i++) {
            const stone = stones[i].value;
            const count = stones[i].count;
            const val = BigInt(stone);
            if (val === 0n) {
                stones2.push({ value: "1", count: count });
                continue;
            }
            if (stone.length % 2 === 0) {
                const val1 = stone.slice(0, stone.length / 2);
                const val2 = stone.slice(stone.length / 2);
                stones2.push(
                    { value: val1, count: count },
                    { value: val2.replace(/^0+/, ""), count: count }
                );
                continue;
            }
            stones2.push({ value: String(val * 2024n), count: count });
        }
        return stones2;
    };

    const reduce = (stones) => {
        const stoneMap = new Map();
        for (const stone of stones) {
            stoneMap.set(
                stone.value,
                (stoneMap.get(stone.value) ?? 0) + stone.count
            );
        }
        return [...stoneMap.entries()].map(([a, b]) => ({
            value: a,
            count: b,
        }));
    };

    for (let i = 0; i < 25; i++) {
        stones = blink(stones);
        stones = reduce(stones);
    }

    const partOne = stones.map((x) => x.count).reduce((a, b) => a + b, 0);

    for (let i = 0; i < 50; i++) {
        stones = blink(stones);
        stones = reduce(stones);
    }

    const partTwo = stones.map((x) => x.count).reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
