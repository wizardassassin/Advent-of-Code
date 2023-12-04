/**
 * --- Day 4: Scratchcards ---
 *
 * https://adventofcode.com/2023/day/4
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const [cardName, numbers] = x.split(": ");
        const card = Number(cardName.split(/ +/)[1]);
        const [win, have] = numbers.split(" | ").map((x2) =>
            x2
                .trim()
                .split(/ +/)
                .map((x3) => Number(x3))
        );
        return { card, win, have };
    });

    const winCount = arr.map((x) => {
        const set_have = new Set(x.have);
        const win_nums = x.win.filter((x2) => set_have.has(x2));
        return win_nums.length;
    });
    const partOne = winCount
        .filter((x) => x !== 0)
        .reduce((a, b) => a + 2 ** (b - 1), 0);

    const scratchSum = Array.from({ length: arr.length }, () => 1);
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < winCount[i]; j++) {
            scratchSum[i + j + 1] += scratchSum[i];
        }
    }
    const partTwo = scratchSum.reduce((a, b) => a + b);

    return { partOne, partTwo };
}
