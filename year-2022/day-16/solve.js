/**
 * --- Day 16: Proboscidea Volcanium ---
 *
 * https://adventofcode.com/2022/day/16
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    /**
     * @typedef nodeObj
     * @type {object}
     * @property {string} name
     * @property {number} index
     * @property {number} rate
     * @property {string[]} edges
     * @property {nodeObj[]} edges2
     * @property {Map<string, number>} distanceTo
     * @property {Set<string>} unsetDistances
     */

    /** @type {nodeObj[]} */
    const nodeArr = input.split("\n").map((x, i) => {
        const matches = x.match(
            /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (\w+(?:, \w+)*)/
        );
        const name = matches[1];
        const rate = Number(matches[2]);
        const edges = matches[3].split(", ");
        return { name, index: i, rate, edges };
    });

    const nodeMap = new Map(nodeArr.map((x) => [x.name, x]));
    const names = nodeArr.map((x) => x.name);

    const nodeCount = nodeArr.length;
    let setConnections = 0;
    const maxConnections = nodeCount ** 2;

    nodeArr.forEach((x) => {
        x.edges2 = x.edges.map((x2) => nodeMap.get(x2));
        x.distanceTo = new Map(names.map((x) => [x, Infinity]));
        x.distanceTo.set(x.name, 0);
        setConnections++;
        x.unsetDistances = new Set(names);
        x.unsetDistances.delete(x.name);
    });

    for (const node of nodeArr) {
        for (const edge of node.edges) {
            node.distanceTo.set(edge, 1);
            node.unsetDistances.delete(edge);
            setConnections++;
        }
    }

    while (setConnections < maxConnections) {
        for (const node of nodeArr) {
            const distArr = [...node.unsetDistances];
            const unsetLen = distArr.length;
            const minDistances = Array.from(
                {
                    length: unsetLen,
                },
                () => Infinity
            );
            for (const edge of node.edges2) {
                const distances = distArr.map((x) => edge.distanceTo.get(x));
                for (let i = 0; i < unsetLen; i++) {
                    minDistances[i] = Math.min(minDistances[i], distances[i]);
                }
            }
            for (let i = 0; i < unsetLen; i++) {
                const dist = minDistances[i];
                if (dist === Infinity) continue;
                const distName = distArr[i];
                node.distanceTo.set(distName, dist + 1);
                setConnections++;
                node.unsetDistances.delete(distName);
            }
        }
    }

    const toOpenValves = nodeArr.filter((x) => x.rate > 0).map((x) => x.name);

    const toOpenValvesCount = toOpenValves.length;

    const toOpenValvesSet = new Set(toOpenValves);

    const startNode = nodeMap.get("AA");

    const calcRelease = (dist_time, release_rate, remain_time) =>
        release_rate * (remain_time - (dist_time + 1));

    const simple_cache = new Map();

    /**
     * Brute Force
     *
     * @param {nodeObj} node
     * @param {number} released
     * @param {number} time
     */
    const searchValves = (node, released, time) => {
        const key = node.name + time;
        // ~130ms with no cache
        // ~12ms with cache
        if (simple_cache.has(key))
            if (simple_cache.get(key) >= released) return released;
        simple_cache.set(key, released);
        if (time <= 1) {
            return released;
        }
        if (toOpenValvesSet.size === 0) {
            return released;
        }
        let maxRelease = released;
        for (const valve of [...toOpenValvesSet]) {
            toOpenValvesSet.delete(valve);
            const valveObj = nodeMap.get(valve);
            const remain_time = time;
            const dist_time = node.distanceTo.get(valve);
            const leftover_time = remain_time - (dist_time + 1);
            const totalRelease = calcRelease(dist_time, valveObj.rate, time);
            const release1 = searchValves(
                valveObj,
                released + Math.max(totalRelease, 0),
                leftover_time
            );
            maxRelease = Math.max(maxRelease, release1);
            toOpenValvesSet.add(valve);
        }
        return maxRelease;
    };

    const max_release = searchValves(startNode, 0, 30);

    const partOne = max_release;

    const get_release = (node, valve, remain_time) => {
        const valveObj = nodeMap.get(valve);
        const dist_time = node.distanceTo.get(valve);
        const leftover_time = remain_time - (dist_time + 1);
        const totalRelease = calcRelease(dist_time, valveObj.rate, remain_time);
        return [valveObj, Math.max(totalRelease, 0), leftover_time];
    };

    const cache = new Map();

    const nameMap = new Map(nodeArr.map((x, i) => [x.name, i]));

    const shift_1 = Math.max(
        Math.ceil(Math.log2(nodeCount - 1 + (nodeCount - 2))),
        1
    );

    // flawed hashing
    const hash_key = (h_name, e_name, h_time, e_time) =>
        nameMap.get(h_name) +
        nameMap.get(e_name) +
        (h_time << shift_1) +
        (e_time << shift_1);

    /**
     *
     * @param {nodeObj} h_node
     * @param {nodeObj} e_node
     * @param {number} h_time
     * @param {number} e_time
     * @param {number} released
     * @param {number} time
     * @returns
     */
    const searchValves2 = (h_node, e_node, h_time, e_time, released, time) => {
        // needs cache
        const key1 = hash_key(h_node.name, e_node.name, h_time, e_time);
        if (cache.has(key1)) {
            if (cache.get(key1) >= released) return released;
        }

        cache.set(key1, released);
        if (time <= 1) {
            return released;
        }
        if (toOpenValvesSet.size === 0) {
            return released;
        }
        const compute_h = h_time === time;
        const compute_e = e_time === time;
        const compute_both = h_time === e_time;
        let maxRelease = released;
        const remain_valves = [...toOpenValvesSet];
        const remain_len = remain_valves.length;
        for (let i = 0; i < remain_len; i++) {
            const valve = remain_valves[i];
            toOpenValvesSet.delete(valve);
            if (compute_both) {
                const [valveObj_h, totalRelease_h, leftover_time_h] =
                    get_release(h_node, valve, time);
                for (let j = 0; j < remain_len; j++) {
                    if (i === j) continue;
                    const valve2 = remain_valves[j];
                    toOpenValvesSet.delete(valve2);
                    const [valveObj_e, totalRelease_e, leftover_time_e] =
                        get_release(e_node, valve2, time);
                    const release1 = searchValves2(
                        valveObj_h,
                        valveObj_e,
                        leftover_time_h,
                        leftover_time_e,
                        released + totalRelease_h + totalRelease_e,
                        Math.max(leftover_time_h, leftover_time_e)
                    );
                    maxRelease = Math.max(maxRelease, release1);
                    toOpenValvesSet.add(valve2);
                }
            } else if (compute_h) {
                const [valveObj_h, totalRelease_h, leftover_time_h] =
                    get_release(h_node, valve, time);
                const release1 = searchValves2(
                    valveObj_h,
                    e_node,
                    leftover_time_h,
                    e_time,
                    released + totalRelease_h,
                    Math.max(leftover_time_h, e_time)
                );
                maxRelease = Math.max(maxRelease, release1);
            } else {
                const [valveObj_e, totalRelease_e, leftover_time_e] =
                    get_release(e_node, valve, time);
                const release1 = searchValves2(
                    h_node,
                    valveObj_e,
                    h_time,
                    leftover_time_e,
                    released + totalRelease_e,
                    Math.max(h_time, leftover_time_e)
                );
                maxRelease = Math.max(maxRelease, release1);
            }
            toOpenValvesSet.add(valve);
        }
        return maxRelease;
    };

    const max_release2 = searchValves2(startNode, startNode, 26, 26, 0, 26);

    const partTwo = max_release2;

    return { partOne, partTwo };
}
