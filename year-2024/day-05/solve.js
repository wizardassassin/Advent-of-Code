/**
 * --- Day 5: Print Queue ---
 *
 * https://adventofcode.com/2024/day/5
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const [rulesRaw, orderingsRaw] = input.split("\n\n");

    const rules = rulesRaw.split("\n").map((x) => x.split("|"));
    const orderings = orderingsRaw.split("\n").map((x) => x.split(","));

    let sum = 0;

    const satisfiesRules = (num, num2, brokenRule = undefined) => {
        for (const [first, second] of rules) {
            if (second === num && first === num2) {
                if (brokenRule) brokenRule.brokenRule = [first, second];
                return false;
            }
        }
        return true;
    };

    const isInOrder = (ordering, brokenRule = undefined) => {
        for (let j = 0; j < ordering.length; j++) {
            const num = ordering[j];
            for (let k = j + 1; k < ordering.length; k++) {
                const num2 = ordering[k];
                if (!satisfiesRules(num, num2, brokenRule)) return false;
            }
        }
        return true;
    };

    for (let i = 0; i < orderings.length; i++) {
        const ordering = orderings[i];
        if (isInOrder(ordering)) {
            sum += Number(ordering[Math.floor(ordering.length / 2)]);
        }
    }

    const partOne = sum;

    let sum2 = 0;

    for (let i = 0; i < orderings.length; i++) {
        const ordering = orderings[i];
        if (!isInOrder(ordering)) {
            const ordering2 = ordering.slice();
            const brokenRule = { brokenRule: [] };
            while (!isInOrder(ordering2, brokenRule)) {
                const index1 = ordering2.indexOf(brokenRule.brokenRule[0]);
                const index2 = ordering2.indexOf(brokenRule.brokenRule[1]);
                const temp = ordering2[index1];
                ordering2[index1] = ordering2[index2];
                ordering2[index2] = temp;
            }
            sum2 += Number(ordering2[Math.floor(ordering2.length / 2)]);
        }
    }

    const partTwo = sum2;

    return { partOne, partTwo };
}
