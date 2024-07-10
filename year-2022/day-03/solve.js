/**
 * --- Day 3: Rucksack Reorganization ---
 *
 * https://adventofcode.com/2022/day/3
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const halfLen = x.length / 2;
        const comp1 = x.slice(0, halfLen).split("");
        const comp2 = x.slice(halfLen).split("");
        return [
            [comp1, new Set(comp1)],
            [comp2, new Set(comp2)],
        ];
    });

    const getPriority = (c) =>
        c === c.toUpperCase() ? c.charCodeAt() - 38 : c.charCodeAt() - 96;

    const PartOne = arr
        .map((x) => {
            const newArr = [...x[0][1]].filter((x2) => x[1][1].has(x2));
            if (newArr.length !== 1) console.log(newArr);
            return newArr.map(getPriority).reduce((a, b) => a + b);
        })
        .reduce((a, b) => a + b);
    const PartTwo = arr
        .reduce((a, b) => {
            const retSet = new Set([...b[0][1], ...b[1][1]]);
            if (a.length === 0 || a[a.length - 1].length === 3) {
                a.push([retSet]);
                return a;
            }
            const lastArr = a[a.length - 1];
            lastArr.push(retSet);
            return a;
        }, [])
        .map((x) => {
            const combined = [...x[0]].filter(
                (x2) => x[1].has(x2) && x[2].has(x2)
            );
            if (combined.length !== 1) console.log(all3Sets);
            return combined[0];
        })
        .map(getPriority)
        .reduce((a, b) => a + b);

    return { partOne: PartOne, partTwo: PartTwo };
}
