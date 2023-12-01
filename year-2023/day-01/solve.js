/**
 * --- Day 1: Trebuchet?! ---
 *
 * https://adventofcode.com/2023/day/1
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) =>
        x
            .split("")
            .map((x2) => Number(x2))
            .filter((x2) => Number.isFinite(x2))
    );

    const partOne = arr.reduce((a, b) => a + b.at(0) * 10 + b.at(-1), 0);

    const arr2 = input.split("\n");

    let sum = 0;
    for (const num of arr2) {
        const index1 = num.indexOf("one");
        const index2 = num.indexOf("two");
        const index3 = num.indexOf("three");
        const index4 = num.indexOf("four");
        const index5 = num.indexOf("five");
        const index6 = num.indexOf("six");
        const index7 = num.indexOf("seven");
        const index8 = num.indexOf("eight");
        const index9 = num.indexOf("nine");
        const index10 = num.lastIndexOf("one");
        const index20 = num.lastIndexOf("two");
        const index30 = num.lastIndexOf("three");
        const index40 = num.lastIndexOf("four");
        const index50 = num.lastIndexOf("five");
        const index60 = num.lastIndexOf("six");
        const index70 = num.lastIndexOf("seven");
        const index80 = num.lastIndexOf("eight");
        const index90 = num.lastIndexOf("nine");
        const arr3 = num.split("");
        const arr4 = num
            .split("")
            .map((x) => Number(x))
            .filter((x2) => Number.isFinite(x2));
        const num1 = arr4[0];
        const num2 = arr4.at(-1);
        const indexa = arr3.indexOf("" + num1);
        const indexb = arr3.lastIndexOf("" + num2);
        const data = [
            { index: index1, value: 1 },
            { index: index2, value: 2 },
            { index: index3, value: 3 },
            { index: index4, value: 4 },
            { index: index5, value: 5 },
            { index: index6, value: 6 },
            { index: index7, value: 7 },
            { index: index8, value: 8 },
            { index: index9, value: 9 },
            { index: index10, value: 1 },
            { index: index20, value: 2 },
            { index: index30, value: 3 },
            { index: index40, value: 4 },
            { index: index50, value: 5 },
            { index: index60, value: 6 },
            { index: index70, value: 7 },
            { index: index80, value: 8 },
            { index: index90, value: 9 },
            { index: indexa, value: num1 },
            { index: indexb, value: num2 },
        ].filter((x) => x.index !== -1);
        const a_max = Math.max(...data.map((x) => x.index));
        const a_min = Math.min(...data.map((x) => x.index));
        const v1 = data.find((x) => x.index == a_min).value;
        const v2 = data.find((x) => x.index == a_max).value;
        sum += v1 * 10 + v2;
    }

    const partTwo = sum;

    return { partOne, partTwo };
}
