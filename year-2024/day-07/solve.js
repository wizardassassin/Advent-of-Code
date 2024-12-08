/**
 * --- Day 7: Bridge Repair ---
 *
 * https://adventofcode.com/2024/day/7
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x) => x.split(": "))
        .map(([total, nums]) => ({
            total: Number(total),
            nums: nums.split(" ").map(Number),
        }));

    /**
     *
     * @param {number[]} nums
     * @param {number} total
     * @returns {number[]}
     */
    const getPossibleTotals = (nums = [], total = 0, withConcat = false) => {
        if (nums.length === 0) return [total];
        return [
            ...getPossibleTotals(nums.slice(1), total + nums[0], withConcat),
            ...getPossibleTotals(nums.slice(1), total * nums[0], withConcat),
            ...(withConcat
                ? getPossibleTotals(
                      nums.slice(1),
                      total * 10 ** Math.floor(Math.log10(nums[0]) + 1) +
                          nums[0],
                      withConcat
                  )
                : []),
        ];
    };

    // too few possibilities to need memoization
    const possibilities = arr.map((x) => ({
        ...x,
        poss: getPossibleTotals(x.nums.slice(1), x.nums[0]),
        poss2: getPossibleTotals(x.nums.slice(1), x.nums[0], true),
    }));

    const partOne = possibilities
        .filter((x) => x.poss.includes(x.total))
        .map((x) => x.total)
        .reduce((a, b) => a + b, 0);
    const partTwo = possibilities
        .filter((x) => x.poss2.includes(x.total))
        .map((x) => x.total)
        .reduce((a, b) => a + b, 0);

    return { partOne, partTwo };
}
