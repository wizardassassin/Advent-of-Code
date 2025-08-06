/**
 * --- Day 3: Binary Diagnostic ---
 *
 * https://adventofcode.com/2021/day/3
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n");

    const digitLen = arr[0].length;
    const digitSum = Array.from({ length: arr[0].length }, () => 0);
    const lines = arr.length;

    for (const line of arr) {
        line.split("").forEach((x, i) => (digitSum[i] += Number(x === "1")));
    }

    const gamma = Array.from(
        { length: arr[0].length },
        (_, i) => digitSum[i] >= lines / 2
    );
    const epsilon = gamma.map((x) => !x);

    const partOne =
        parseInt(gamma.map((x) => Number(x)).join(""), 2) *
        parseInt(epsilon.map((x) => Number(x)).join(""), 2);

    let oxygenArr = arr.slice();
    let co2Arr = arr.slice();

    for (let i = 0; i < digitLen; i++) {
        if (oxygenArr.length <= 1) {
            break;
        }
        const isOneMoreFrequent =
            oxygenArr
                .map((x) => x[i] === "1")
                .reduce((a, b) => a + Number(b), 0) >=
            oxygenArr.length / 2;
        const parseDigit = isOneMoreFrequent ? "1" : "0";
        oxygenArr = oxygenArr.filter((x) => x[i] === parseDigit);
    }

    for (let i = 0; i < digitLen; i++) {
        if (co2Arr.length <= 1) {
            break;
        }
        const isOneMoreFrequent =
            co2Arr
                .map((x) => x[i] === "1")
                .reduce((a, b) => a + Number(b), 0) >=
            co2Arr.length / 2;
        const parseDigit = !isOneMoreFrequent ? "1" : "0";
        co2Arr = co2Arr.filter((x) => x[i] === parseDigit);
    }

    const partTwo = parseInt(oxygenArr[0], 2) * parseInt(co2Arr[0], 2);

    return { partOne, partTwo };
}
