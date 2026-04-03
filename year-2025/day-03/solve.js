/**
 * --- Day 3: Lobby ---
 *
 * https://adventofcode.com/2025/day/3
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split("").map(Number))
        .map((x) => {
            const maxFirst = Math.max(...x.slice(0, -1));
            const firstInd = x.findIndex((x) => x === maxFirst);
            const maxSecond = Math.max(...x.slice(firstInd + 1));
            const secondInd = x.findIndex((x) => x === maxSecond);
            const jolts2 = getMaxJolts(x.slice(), 12);
            return { battery: x, maxJolts: maxFirst * 10 + maxSecond, jolts2 };
        });

    const partOne = arr.reduce((a, b) => a + b.maxJolts, 0);
    const partTwo = arr.reduce((a, b) => a + b.jolts2, 0);

    return { partOne, partTwo };
}

/**
 *
 * @param {number[]} battery
 * @param {number} digits
 */
function getMaxJolts(battery, digits) {
    let jolts = 0;
    while (battery.length !== 0 && digits !== 0) {
        const searchWindow =
            digits > 1 ? battery.slice(0, -(digits - 1)) : battery;
        const maxVal = Math.max(...searchWindow);
        const maxInd = searchWindow.findIndex((x) => x === maxVal);
        jolts = jolts * 10 + maxVal;
        digits--;
        battery = battery.slice(maxInd + 1);
    }
    return jolts;
}
