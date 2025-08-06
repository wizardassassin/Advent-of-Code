/**
 * --- Day 4: Giant Squid ---
 *
 * https://adventofcode.com/2021/day/4
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const [order, ...boards] = input.split("\n\n");

    const order2 = order
        .trim()
        .split(",")
        .map((x) => Number(x));

    const boards2 = boards.map((x) =>
        x
            .trim()
            .split("\n")
            .map((x) =>
                x
                    .trim()
                    .split(/ +/)
                    .map((x) => Number(x.trim()))
            )
    );

    let numberIndex = 0;
    const getNumber = () => order2[numberIndex++];

    const markBoard = (board, num) => {
        return board.map((x) => x.map((x2) => (x2 === num ? "-" : x2)));
    };

    const hasWon = (board) => {
        for (let i = 0; i < board.length; i++) {
            let didWin = true;
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] !== "-") {
                    didWin = false;
                    break;
                }
            }
            if (didWin) return true;
        }
        for (let j = 0; j < board[0].length; j++) {
            let didWin = true;
            for (let i = 0; i < board.length; i++) {
                if (board[i][j] !== "-") {
                    didWin = false;
                    break;
                }
            }
            if (didWin) return true;
        }
        return false;
    };

    let boards3 = structuredClone(boards2);

    let calledNumber = -1;

    while (!boards3.some((x) => hasWon(x))) {
        calledNumber = getNumber();
        boards3 = boards3.map((x) => markBoard(x, calledNumber));
    }

    let winningBoard = boards3.find((x) => hasWon(x));

    const partOne =
        winningBoard
            .flat()
            .filter((x) => x !== "-")
            .reduce((a, b) => a + b, 0) * calledNumber;

    boards3 = boards3.filter((x) => x !== winningBoard);

    while (boards3.length !== 0) {
        while (!boards3.some((x) => hasWon(x))) {
            calledNumber = getNumber();
            boards3 = boards3.map((x) => markBoard(x, calledNumber));
        }
        winningBoard = boards3.find((x) => hasWon(x));
        boards3 = boards3.filter((x) => x !== winningBoard);
    }

    const partTwo =
        winningBoard
            .flat()
            .filter((x) => x !== "-")
            .reduce((a, b) => a + b, 0) * calledNumber;

    return { partOne, partTwo };
}
