/**
 * --- Day 16: The Floor Will Be Lava ---
 *
 * https://adventofcode.com/2023/day/16
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input
        .split("\n")
        .map((x, i) => x.split("").map((x2, j) => new Cell(x2, i, j)));

    Cell.cell_arr = arr;

    Cell.cell_arr[0][0].propagate(">");

    const partOne = Cell.getEnergizedCount();

    Cell.resetGrid();

    const rows = arr.length;
    const cols = arr[0].length;

    let maxCount = 0;
    const testCell = (i, j, direction) => {
        Cell.cell_arr[i][j].propagate(direction);
        maxCount = Math.max(maxCount, Cell.getEnergizedCount());
        Cell.resetGrid();
    };

    for (let a = 0; a < cols; a++) {
        testCell(0, a, "v");
    }
    for (let a = 0; a < rows; a++) {
        testCell(a, cols - 1, "<");
    }
    for (let a = cols - 1; a >= 0; a--) {
        testCell(rows - 1, a, "^");
    }
    for (let a = rows - 1; a >= 0; a--) {
        testCell(a, 0, ">");
    }

    const partTwo = maxCount;

    return { partOne, partTwo };
}

// enums should be a thing
// maybe a bitset
class Cell {
    static directions = [">", "^", "<", "v"];
    static mirrors = [".", "|", "-", "/", "\\"];
    /** @type {Cell[][]} */
    static cell_arr;

    mirror;
    direction_arr;
    i;
    j;
    /**
     *
     * @param {string} mirror
     * @param {number} i
     * @param {number} j
     */
    constructor(mirror, i, j) {
        this.mirror = mirror;
        this.i = i;
        this.j = j;
        this.direction_arr = [];
    }

    /**
     *
     * @param {string} direction
     */
    propagate(direction) {
        if (this.direction_arr.includes(direction)) return;
        this.direction_arr.push(direction);
        const nextDirections = this.#calculateNext(direction);
        for (const nextDir of nextDirections) {
            const [d_i, d_j] = Cell.#getOffset(nextDir);
            const cell = Cell.getCell(this.i + d_i, this.j + d_j);
            cell?.propagate(nextDir);
        }
    }

    /**
     *
     * @param {string} direction
     */
    #calculateNext(direction) {
        if (this.mirror === ".") return [direction];
        if (this.mirror === "|") {
            if (direction === "v" || direction === "^") return [direction];
            return ["v", "^"];
        }
        if (this.mirror === "-") {
            if (direction === ">" || direction === "<") return [direction];
            return [">", "<"];
        }
        if (this.mirror === "/") {
            if (direction === ">") return ["^"];
            if (direction === "<") return ["v"];
            if (direction === "^") return [">"];
            if (direction === "v") return ["<"];
        }
        if (this.mirror === "\\") {
            if (direction === ">") return ["v"];
            if (direction === "<") return ["^"];
            if (direction === "^") return ["<"];
            if (direction === "v") return [">"];
        }
        console.assert(false);
        return [];
    }

    /**
     *
     * @param {string} direction
     */
    static #getOffset(direction) {
        if (direction === ">") return [0, 1];
        if (direction === "<") return [0, -1];
        if (direction === "^") return [-1, 0];
        if (direction === "v") return [1, 0];
        console.assert(false);
        return [];
    }

    static getCell(i, j) {
        return Cell.cell_arr[i]?.[j];
    }

    static getGrid() {
        return Cell.cell_arr
            .map((x) =>
                x
                    .map((x2) => (x2.direction_arr.length !== 0 ? "#" : "."))
                    .join("")
            )
            .join("\n");
    }

    static getEnergizedCount() {
        return Cell.cell_arr
            .map((x) =>
                x.reduce((a, b) => a + Number(b.direction_arr.length !== 0), 0)
            )
            .reduce((a, b) => a + b, 0);
    }

    static resetGrid() {
        for (const cell_row of Cell.cell_arr) {
            for (const cell of cell_row) {
                cell.direction_arr = [];
            }
        }
    }
}
