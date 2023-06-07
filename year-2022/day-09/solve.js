/**
 * --- Day 9: Rope Bridge ---
 *
 * https://adventofcode.com/2022/day/9
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const [move, count] = x.split(" ");
        const coord = { i: 0, j: 0 };
        switch (move) {
            case "U":
                coord.i = -1;
                coord.j = 0;
                break;
            case "D":
                coord.i = 1;
                coord.j = 0;
                break;
            case "L":
                coord.i = 0;
                coord.j = -1;
                break;
            case "R":
                coord.i = 0;
                coord.j = 1;
                break;
        }
        return { direction: coord, count: Number(count) };
    });

    const head = { i: 0, j: 0 };
    const tail = { i: 0, j: 0 };
    const prevHead = { i: 0, j: 0 };

    const isDisconnected = () =>
        Math.abs(head.i - tail.i) > 1 || Math.abs(head.j - tail.j) > 1;

    const coordScore = new Set();

    coordScore.add(`${tail.i}-${tail.j}`);

    for (const { direction, count } of arr) {
        for (let i = 0; i < count; i++) {
            prevHead.i = head.i;
            prevHead.j = head.j;
            head.i += direction.i;
            head.j += direction.j;
            if (isDisconnected()) {
                tail.i = prevHead.i;
                tail.j = prevHead.j;
            }
            coordScore.add(`${tail.i}-${tail.j}`);
        }
    }

    const partOne = coordScore.size;

    const rope_size = 10;

    const ropeArr = [];

    for (let i = 0; i < rope_size; i++) {
        ropeArr.push([0, 0]);
    }

    const coordScore2 = new Set();

    const isDisconnected2 = (coord1, coord2) =>
        Math.abs(coord1[0] - coord2[0]) > 1 ||
        Math.abs(coord1[1] - coord2[1]) > 1;

    coordScore2.add("0-0");

    const print_rope = () => {
        const offset_i = 5;
        const offset_j = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (
                    ropeArr.some(
                        (x) => x[0] + offset_i === i && x[1] + offset_j === j
                    )
                ) {
                    process.stdout.write("A");
                } else {
                    process.stdout.write(".");
                }
            }
            process.stdout.write("\n");
        }
        process.stdout.write("\n");
    };

    const getDirection = (coord1, coord2) => [
        Math.max(Math.min(coord2[0] - coord1[0], 1), -1),
        Math.max(Math.min(coord2[1] - coord1[1], 1), -1),
    ];

    for (const { direction, count } of arr) {
        for (let i = 0; i < count; i++) {
            ropeArr[rope_size - 1][0] += direction.i;
            ropeArr[rope_size - 1][1] += direction.j;
            for (let j = rope_size - 2; j >= 0; j--) {
                if (isDisconnected2(ropeArr[j], ropeArr[j + 1])) {
                    const [move_i, move_j] = getDirection(
                        ropeArr[j],
                        ropeArr[j + 1]
                    );
                    // console.log(move_i, move_j);
                    ropeArr[j][0] += move_i;
                    ropeArr[j][1] += move_j;
                }
            }
            const tail = ropeArr[0];
            coordScore2.add(`${tail[0]}-${tail[1]}`);
            // print_rope();
        }
    }

    const partTwo = coordScore2.size;

    return { partOne, partTwo };
}
