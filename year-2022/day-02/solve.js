/**
 * --- Day 2: Rock Paper Scissors ---
 *
 * https://adventofcode.com/2022/day/2
 *
 * @param {string} input Problem Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.trim().split(" "));
    const scoreVals = {
        X: 1,
        Y: 2,
        Z: 3,
    };
    const relations = {
        A: {
            X: 3,
            Y: 6,
            Z: 0,
        },
        B: {
            X: 0,
            Y: 3,
            Z: 6,
        },
        C: {
            X: 6,
            Y: 0,
            Z: 3,
        },
    };
    const relations2 = {
        A: {
            X: "Z",
            Y: "X",
            Z: "Y",
        },
        B: {
            X: "X",
            Y: "Y",
            Z: "Z",
        },
        C: {
            X: "Y",
            Y: "Z",
            Z: "X",
        },
    };
    const winScore = (opp, you) => relations[opp][you];
    const pickScore = (move) => scoreVals[move];
    const convertCode = (opp, you) => relations2[opp][you];
    const getScore = (opp, you) => winScore(opp, you) + pickScore(you);
    const totalScore = arr
        .map(([a, b]) => getScore(a, b))
        .reduce((a, b) => a + b);
    const totalScore2 = arr
        .map(([a, b]) => getScore(a, convertCode(a, b)))
        .reduce((a, b) => a + b);

    return { PartOne: totalScore, PartTwo: totalScore2 };
}
