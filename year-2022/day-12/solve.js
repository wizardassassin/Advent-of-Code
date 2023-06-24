/**
 * --- Day 12: Hill Climbing Algorithm ---
 *
 * https://adventofcode.com/2022/day/12
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => x.split(""));

    const rows = arr.length;
    const cols = arr[0].length;

    const findSymbol = (s) => {
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++) if (arr[i][j] === s) return [i, j];
    };

    const getStepDistance = (i_1, j_1, i_2, j_2) =>
        Math.abs(i_1 - i_2) + Math.abs(j_1 - j_2);

    const getChar = (i, j) => {
        const char1 = arr[i][j];
        if (char1 === "S") {
            return "a";
        }
        if (char1 === "E") {
            return "z";
        }
        return char1;
    };

    const getStart = findSymbol("S");
    const getEnd = findSymbol("E");

    const queue = new PQueue();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const node = new Node(
                i,
                j,
                getStepDistance(i, j, getEnd[0], getEnd[1]),
                getChar(i, j)
            );
            Node.nodeMap.set(node.name, node);
            queue.push(node);
        }
    }

    queue.sort();

    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ];

    const validCoord = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;

    const validNode = (i, j, new_i, new_j) => {
        if (!validCoord(new_i, new_j)) {
            return;
        }
        const char1 = getChar(i, j);
        const char2 = getChar(new_i, new_j);
        return char2.charCodeAt() - char1.charCodeAt() <= 1;
    };

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const node = Node.nodeMap.get(`${i}-${j}`);
            for (const direction of directions) {
                const new_i = i + direction[0];
                const new_j = j + direction[1];
                if (validNode(i, j, new_i, new_j)) {
                    node.addEdge(Node.nodeMap.get(`${new_i}-${new_j}`));
                }
            }
        }
    }

    const startName = `${getStart[0]}-${getStart[1]}`;
    const endName = `${getEnd[0]}-${getEnd[1]}`;

    const startNode = Node.nodeMap.get(startName);
    startNode.distance = 0;

    queue.sort();

    const endNode = Node.nodeMap.get(endName);

    while (!queue.empty()) {
        const currNode = queue.pop();
        if (currNode.name === endName) {
            break;
        }
        currNode.expandEdges();
        currNode.visited = true;
        queue.sort();
    }

    const partOne = endNode.distance;

    Node.reset();
    Node.flip();

    queue.clear();

    for (const node of [...Node.nodeMap.values()]) {
        queue.push(node);
    }

    endNode.distance = 0;

    queue.sort();

    let a_node;

    while (!queue.empty()) {
        const currNode = queue.pop();
        if (currNode.symbol === "a") {
            a_node = currNode;
            break;
        }
        currNode.expandEdges();
        currNode.visited = true;
        queue.sort();
    }

    const partTwo = a_node.distance;

    return { partOne, partTwo };
}

class PQueue {
    #queue;
    constructor() {
        this.#queue = [];
    }

    push(val) {
        this.#queue.push(val);
    }

    push2(val) {
        const pushIndex = this.#queue.findIndex((x) => x.weight > val.weight);
        const index = pushIndex === -1 ? this.#queue.length : pushIndex;
        this.#queue.splice(index, 0, val);
    }

    pop() {
        return this.#queue.shift();
    }

    sort() {
        this.#queue.sort((a, b) => a.weight - b.weight);
    }

    empty() {
        return this.#queue.length === 0;
    }

    clear() {
        this.#queue = [];
    }
}

class Node {
    static nodeMap = new Map();

    static reset() {
        const nodeGen = Node.nodeMap.entries();
        let nodeObj = nodeGen.next();
        while (!nodeObj.done) {
            nodeObj.value[1].clear();
            nodeObj = nodeGen.next();
        }
    }

    static flip() {
        const nodeArr = [...Node.nodeMap.entries()].map((x) => x[1]);
        for (const node of nodeArr) {
            node.flip();
        }
        for (const node of nodeArr) {
            node.swapEdges();
        }
    }

    #i;
    #j;
    name;
    distance;
    visited;
    #heuristic;
    #edges;
    #tempEdges;
    #prevNode;
    symbol;
    constructor(i, j, heuristic, symbol) {
        this.#i = i;
        this.#j = j;
        this.visited = false;
        this.name = `${this.#i}-${this.#j}`;
        this.distance = Infinity;
        this.#heuristic = heuristic;
        this.#edges = [];
        this.#tempEdges = [];
        this.#prevNode = null;
        this.symbol = symbol;
    }

    get weight() {
        return this.distance + this.#heuristic;
    }

    get prevNode() {
        return this.#prevNode;
    }

    addEdge(newEdge) {
        this.#edges.push([newEdge, 1]);
    }

    updateDistance(newNode, weight) {
        if (this.distance > newNode.distance + weight) {
            this.distance = newNode.distance + weight;
            this.#prevNode = newNode;
        }
    }

    expandEdges() {
        for (const [node, weight] of this.#edges) {
            if (node.visited) continue;
            node.updateDistance(this, weight);
        }
    }

    clear() {
        this.distance = Infinity;
        this.#prevNode = null;
        this.visited = false;
    }

    flip() {
        for (const [edge, weight] of this.#edges) {
            edge.#tempEdges.push([this, weight]);
        }
        this.#edges = [];
        // this.#heuristic = -this.#heuristic;
        this.#heuristic = 0;
    }

    swapEdges() {
        this.#edges = this.#tempEdges;
        this.#tempEdges = [];
    }
}
