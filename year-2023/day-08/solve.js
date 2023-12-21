// import util from "util";

/**
 * --- Day 8: Haunted Wasteland ---
 *
 * https://adventofcode.com/2023/day/8
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const [moves, nodes] = input.split("\n\n");
    const moves2 = moves.split("");
    const nodes2 = nodes.split("\n").map((x) => {
        const matches = x.match(/([A-Z0-9]+) = \(([A-Z0-9]+), ([A-Z0-9]+)\)/);
        return { key: matches[1], left: matches[2], right: matches[3] };
    });
    /** @type {Map<string,typeof nodes2[number]>} */
    const nodeMap = new Map();
    for (const node of nodes2) {
        nodeMap.set(node.key, node);
    }
    let moveIndex = 0;
    let node = nodeMap.get("AAA");
    let count = 0;
    while (node.key !== "ZZZ") {
        const nextNode = moves2[moveIndex] === "L" ? node.left : node.right;
        node = nodeMap.get(nextNode);
        moveIndex = (moveIndex + 1) % moves2.length;
        count++;
    }

    const partOne = count;

    const simNodes = nodes2.filter((x) => x.key.at(-1) === "A");
    const simIntervals = simNodes.map((x) => {
        let node = x;
        let count = 0;
        let moveIndex = 0;
        const visitedNodes = new Map();
        while (!visitedNodes.has(node.key + "-" + moveIndex)) {
            visitedNodes.set(node.key + "-" + moveIndex, count);
            node = nodeMap.get(
                moves2[moveIndex] === "L" ? node.left : node.right
            );
            count++;
            moveIndex = (moveIndex + 1) % moves2.length;
        }
        // console.log(visitedNodes);
        const nodeArr = [...visitedNodes.keys()];
        const zNodeArr = nodeArr.filter((x) => x.split("-")[0].endsWith("Z"));
        const zNodeVal = zNodeArr.map((x) => visitedNodes.get(x));
        const zNodeLL = [];
        // not really a linked list
        const head = {
            key: "head",
            next: null,
            nextCost: null,
        };
        zNodeLL.push(head);
        let prevCost = 0;
        let ptr = head;
        for (let i = 0; i < zNodeVal.length; i++) {
            ptr.nextCost = zNodeVal[i] - prevCost;
            ptr.next = {
                key: zNodeArr[i],
                next: null,
                nextCost: null,
            };
            zNodeLL.push(ptr.next);
            prevCost = zNodeVal[i];
            ptr = ptr.next;
        }
        const nodeLoopKey = node.key + "-" + moveIndex;
        const nodeLoopCost = visitedNodes.get(nodeLoopKey);
        const getNearestZ = () => {
            let prevVal = -1;
            for (let i = 0; i < zNodeVal.length; i++) {
                if (prevVal < nodeLoopCost && nodeLoopCost <= zNodeVal[i]) {
                    return {
                        cost: zNodeVal[i] - nodeLoopCost,
                        key: zNodeArr[i],
                    };
                }
                prevVal = zNodeVal[i];
            }
            throw new Error("Invalid Node Cycle");
        };
        const nearestZ = getNearestZ();
        ptr.nextCost =
            nearestZ.cost +
            (count - zNodeLL.reduce((a, b) => a + b.nextCost, 0));
        ptr.next = zNodeLL.find((x) => x.key === nearestZ.key);
        ptr.next.isCircular = true;
        ptr.next.circularCost = (() => {
            let cost = ptr.nextCost;
            let newPtr = ptr.next;
            while (newPtr !== ptr) {
                cost += newPtr.nextCost;
                newPtr = newPtr.next;
            }
            return cost;
        })();
        // console.log(node);
        // console.log(head);
        // console.log(zNodeVal);
        // console.log(nodeLoopCost);
        return head;
    });
    const allPaths = simIntervals.map((x) => ({ cost: 0, ptr: x }));
    // console.log(util.inspect(allPaths, { depth: null, colors: true }));

    // console.log(allPaths);
    // assert can use gcd
    console.assert(
        allPaths.every(
            (x) =>
                x.ptr.next.isCircular &&
                x.ptr.nextCost === x.ptr.next.nextCost &&
                x.ptr.next.nextCost === x.ptr.next.circularCost
        )
    );
    const gcd = (a, b) => {
        while (b !== 0) [a, b] = [b, a % b];
        return a;
    };
    const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

    const partTwo = allPaths
        .map((x) => x.ptr.nextCost)
        .reduce((a, b) => lcm(a, b));

    return { partOne, partTwo };
}
