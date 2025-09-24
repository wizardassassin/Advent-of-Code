/**
 * --- Day 8: Seven Segment Search ---
 *
 * https://adventofcode.com/2021/day/8
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const [input, output] = x.split(" | ").map((x) => x.split(" "));
        return { input, output };
    });

    const partOne = arr
        .map((x) => x.output)
        .flat()
        .filter(
            (x) =>
                x.length === 2 ||
                x.length === 4 ||
                x.length === 3 ||
                x.length === 7
        ).length;

    let sum = 0;
    for (const display of arr) {
        // 1
        const cf = new Set(display.input.find((x) => x.length === 2).split(""));
        // 4
        const bd = new Set(
            display.input.find((x) => x.length === 4).split("")
        ).difference(cf);
        // 7
        const a = new Set(
            display.input.find((x) => x.length === 3).split("")
        ).difference(cf);
        // 8
        const eg = new Set(display.input.find((x) => x.length === 7).split(""))
            .difference(cf)
            .difference(bd)
            .difference(a);
        // console.log(cf, bd, a, eg);
        // 0 6 9
        const ce = (() => {
            const [num1, num2] = display.input
                .filter((x) => x.length === 6)
                .map((x) => new Set(x.split("")))
                .filter((x) => x.isSupersetOf(bd));
            return num1.symmetricDifference(num2);
        })();
        const c = cf.intersection(ce);
        const e = eg.intersection(ce);
        const f = cf.difference(ce);
        const g = eg.difference(ce);
        // a c e f g
        // 2 3 5
        const d = (() => {
            const [num1, num2, num3] = display.input
                .filter((x) => x.length === 5)
                .map((x) => new Set(x.split("")));
            const adg = num1.intersection(num2).intersection(num3);
            return adg.difference(a).difference(g);
        })();
        const b = bd.difference(d);
        // a b c d e f g
        const isEqual = (a, b) => a.isSubsetOf(b) && a.isSupersetOf(b);
        const letters = [
            [a, b, c, e, f, g],
            [c, f],
            [a, c, d, e, g],
            [a, c, d, f, g],
            [b, c, d, f],
            [a, b, d, f, g],
            [a, b, d, e, f, g],
            [a, c, f],
            [a, b, c, d, e, f, g],
            [a, b, c, d, f, g],
        ].map((x) => x.reduce((a, b) => a.union(b), new Set()));
        let tempSum = 0;
        for (const out of display.output) {
            const outSet = new Set(out.split(""));
            const letter = letters.findIndex((x) => isEqual(x, outSet));
            tempSum *= 10;
            tempSum += letter;
        }
        sum += tempSum;
    }

    const partTwo = sum;

    return { partOne, partTwo };
}
