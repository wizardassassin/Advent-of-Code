/**
 * --- Day 2: Dive! ---
 *
 * https://adventofcode.com/2021/day/2
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n");

    let horizontal = 0;
    let depth = 0;

    for (let i = 0; i < arr.length; i++) {
        let [movement, distance] = arr[i].split(" ");
        if (movement.startsWith("forward")) {
            horizontal += Number(distance);
        } else if (movement.startsWith("down")) {
            depth += Number(distance);
        } else if (movement.startsWith("up")) {
            depth -= Number(distance);
        }
    }

    const partOne = horizontal * depth;

    horizontal = 0;
    depth = 0;
    let aim = 0;

    for (let i = 0; i < arr.length; i++) {
        let [movement, distance] = arr[i].split(" ");
        if (movement.startsWith("forward")) {
            horizontal += Number(distance);
            depth += Number(distance) * aim;
        } else if (movement.startsWith("down")) {
            aim += Number(distance);
        } else if (movement.startsWith("up")) {
            aim -= Number(distance);
        }
    }

    const partTwo = horizontal * depth;

    return { partOne, partTwo };
}
