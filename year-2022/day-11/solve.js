/**
 * --- Day 11: Monkey in the Middle ---
 *
 * https://adventofcode.com/2022/day/11
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n\n")
        .map((x) => x.split("\n"))
        .map((x) => {
            const monkey = Number(x[0].split(" ")[1].slice(0, -1));
            const items = x[1].split(": ")[1].split(", ").map(Number);
            const operation = x[2].split(" = ")[1].split(" ");
            const test = Number(x[3].split(" ").at(-1));
            const ifTrue = Number(x[4].split(" ").at(-1));
            const ifFalse = Number(x[5].split(" ").at(-1));
            return {
                monkey,
                items,
                operation,
                test,
                ifTrue,
                ifFalse,
                inspectCount: 0,
            };
        });

    const arr_p1 = structuredClone(arr);

    const relief = 3;

    const simulateTurn = () => {
        for (const monkey of arr_p1) {
            monkey.items = monkey.items
                .map((x) => {
                    const val1 =
                        monkey.operation[0] === "old"
                            ? x
                            : Number(monkey.operation[0]);
                    const val2 =
                        monkey.operation[2] === "old"
                            ? x
                            : Number(monkey.operation[2]);
                    switch (monkey.operation[1]) {
                        case "*":
                            return val1 * val2;
                        case "+":
                            return val1 + val2;
                    }
                })
                .map((x) => Math.floor(x / relief));
            while (monkey.items.length !== 0) {
                monkey.inspectCount++;
                const val = monkey.items.pop();
                const throwMonkey =
                    val % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
                arr_p1[throwMonkey].items.push(val);
            }
        }
    };

    for (let i = 0; i < 20; i++) {
        simulateTurn();
    }

    const maxVals = arr_p1.map((x) => x.inspectCount).sort((a, b) => b - a);

    const partOne = maxVals[0] * maxVals[1];

    const modVals = arr.map((x) => x.test);

    const arr_p2 = structuredClone(arr).map((x) => {
        x.items = x.items.map((x) => {
            const retObj = {};
            for (const val of modVals) {
                retObj[val] = x % val;
            }
            return retObj;
        });
        return x;
    });

    const simulateTurn2 = () => {
        for (const monkey of arr_p2) {
            monkey.items = monkey.items.map((x) => {
                for (const val of modVals) {
                    const val1 =
                        monkey.operation[0] === "old"
                            ? x[val]
                            : Number(monkey.operation[0]);
                    const val2 =
                        monkey.operation[2] === "old"
                            ? x[val]
                            : Number(monkey.operation[2]);
                    switch (monkey.operation[1]) {
                        case "*":
                            x[val] = (val1 * val2) % val;
                            break;
                        case "+":
                            x[val] = (val1 + val2) % val;
                            break;
                    }
                }
                return x;
            });
            while (monkey.items.length !== 0) {
                monkey.inspectCount++;
                const val = monkey.items.pop();
                const throwMonkey =
                    val[monkey.test] === 0 ? monkey.ifTrue : monkey.ifFalse;
                arr_p2[throwMonkey].items.push(val);
            }
        }
    };

    for (let i = 0; i < 10000; i++) {
        simulateTurn2();
    }

    const maxVals2 = arr_p2.map((x) => x.inspectCount).sort((a, b) => b - a);

    const partTwo = maxVals2[0] * maxVals2[1];

    return { partOne, partTwo };
}
