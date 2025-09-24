/**
 * --- Day 7: The Treachery of Whales ---
 *
 * https://adventofcode.com/2021/day/7
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split(",").map((x) => Number(x));

    arr.sort((a, b) => a - b, 0);

    const getScore = (pos) =>
        arr.map((x) => Math.abs(pos - x)).reduce((a, b) => a + b, 0);

    const uniquePoints = [...new Set(arr)];

    const partOne = Math.min(...uniquePoints.map((x) => getScore(x)));

    const getScore2 = (pos) =>
        arr
            .map((x) => (Math.abs(pos - x) * (Math.abs(pos - x) + 1)) / 2)
            .reduce((a, b) => a + b, 0);

    const scores2 = uniquePoints.map((x) => getScore2(x));

    let startScore2 = Math.min(...scores2);
    let ind = scores2.findIndex((x) => x === startScore2);

    // not even used
    while (true) {
        const prev = getScore2(ind - 1);
        const next = getScore2(ind + 1);
        console.assert(!(prev < startScore2 && next < startScore2));
        if (prev < startScore2) {
            startScore2 = prev;
            ind--;
        } else if (next < startScore2) {
            startScore2 = next;
            ind++;
        } else {
            break;
        }
    }

    const partTwo = startScore2;

    return { partOne, partTwo };
}
