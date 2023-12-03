/**
 * --- Day 2: Cube Conundrum ---
 *
 * https://adventofcode.com/2023/day/2
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const s1 = x.split(": ");
        const id = Number(s1[0].slice(s1[0].lastIndexOf(" ")));
        const trials = [];

        s1[1].split("; ").forEach((x2) => {
            const ret = {
                red: 0,
                green: 0,
                blue: 0,
            };

            x2.split(", ").forEach((x3) => {
                const [num, name] = x3.split(" ");
                ret[name] = Number(num);
            });

            trials.push(ret);
        });

        return { id, trials };
    });

    const maxRed = 12;
    const maxGreen = 13;
    const maxBlue = 14;

    let possibleSum = 0;

    for (const game of arr) {
        if (
            game.trials.some(
                (x) => x.blue > maxBlue || x.green > maxGreen || x.red > maxRed
            )
        ) {
            continue;
        }
        possibleSum += game.id;
    }

    const partOne = possibleSum;

    let sum2 = 0;
    for (const game of arr) {
        const min = game.trials.reduce(
            (a, b) => {
                a.red = Math.max(a.red, b.red);
                a.green = Math.max(a.green, b.green);
                a.blue = Math.max(a.blue, b.blue);
                return a;
            },
            {
                red: 0,
                green: 0,
                blue: 0,
            }
        );
        sum2 += min.red * min.blue * min.green;
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
