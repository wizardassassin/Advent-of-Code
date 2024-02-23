/**
 * --- Day 14: Regolith Reservoir ---
 *
 * https://adventofcode.com/2022/day/14
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) =>
        x.split(" -> ").map((x2) => {
            const coords = x2.split(",");
            return { x: Number(coords[0]), y: Number(coords[1]) };
        })
    );

    const sandCoord = { x: 500, y: 0 };
    const rocks = arr.map((x) => new Rock(x));
    const bound = rocks
        .map((x) => x.bounds)
        .reduce((a, b) => ({
            x_min: Math.min(a.x_min, b.x_min),
            x_max: Math.max(a.x_max, b.x_max),
            y_min: Math.min(a.y_min, b.y_min),
            y_max: Math.max(a.y_max, b.y_max),
        }));

    const inAbyss = (coord) =>
        (coord.x < bound.x_min || coord.x > bound.x_max) &&
        coord.y > bound.y_max;

    const board = Array.from({ length: bound.y_max + 3 }, () =>
        Array.from({ length: bound.x_max + 3 }, () => ".")
    );

    const offset_x = Math.floor(bound.x_min / 2); // offset the x coord to around the center of the grid

    const markBoard = (coord, symbol) =>
        (board[coord.y][coord.x - offset_x] = symbol);

    const getBoard = (coord) => board[coord.y][coord.x - offset_x];

    const canPlace = (coord) => board[coord.y][coord.x - offset_x] === ".";

    const markAll = () => {
        for (const rock of rocks) {
            const currPoint = structuredClone(rock.startCoord);
            markBoard(currPoint, "#");
            for (const path of rock.rockPath) {
                for (let i = 0; i < path.count; i++) {
                    currPoint.x += path.move.x;
                    currPoint.y += path.move.y;
                    markBoard(currPoint, "#");
                }
            }
        }
    };

    markAll();

    const dropSand = (doAbyss) => {
        let point = structuredClone(sandCoord);
        let firstPoint = true;
        while (true) {
            const move_dirs = [
                { x: point.x, y: point.y + 1 },
                { x: point.x - 1, y: point.y + 1 },
                { x: point.x + 1, y: point.y + 1 },
            ].filter((x) => canPlace(x));
            if (move_dirs.length === 0) {
                markBoard(point, "o");
                if (firstPoint) {
                    return true;
                }
                return point;
            }
            point = move_dirs[0];
            if (doAbyss && inAbyss(point)) {
                return false;
            }
            firstPoint = false;
        }
    };

    let count = 0;
    while (true) {
        const point = dropSand(true);
        if (point === false) {
            break;
        }
        count++;
    }

    const partOne = count;

    const clearSand = () => {
        for (let i = 0; i < bound.y_max + 3; i++) {
            for (let j = 0; j < bound.x_max + 3 + 3; j++) {
                if (getBoard({ x: j, y: i }) === "o") {
                    markBoard({ x: j, y: i }, ".");
                }
            }
        }
    };

    clearSand();

    rocks.push(
        new Rock([
            { x: 0 + offset_x, y: bound.y_max + 2 },
            { x: bound.x_max + 2 + offset_x, y: bound.y_max + 2 },
        ])
    );

    markAll();

    let count2 = 0;
    while (true) {
        count2++;
        const point = dropSand(false);
        if (point === true) {
            break;
        }
    }

    const partTwo = count2;

    return { partOne, partTwo };
}

class Rock {
    bounds;
    startCoord;
    endCoord;
    rockData;
    rockPath;
    /**
     *
     * @param {{x: number; y: number}[]} rockData
     */
    constructor(rockData) {
        this.bounds = { x_min: -1, x_max: -1, y_min: -1, y_max: -1 };
        this.startCoord = { x: -1, y: -1 };
        this.endCoord = { x: -1, y: -1 };
        this.rockData = rockData;
        this.rockPath = [];

        const points = this.rockData.length;
        const s_coord = this.rockData.at(0);
        const e_coord = this.rockData.at(-1);
        this.startCoord.x = s_coord.x;
        this.startCoord.y = s_coord.y;
        this.endCoord.x = e_coord.x;
        this.endCoord.y = e_coord.y;
        this.bounds.x_min = this.startCoord.x;
        this.bounds.x_max = this.startCoord.x;
        this.bounds.y_min = this.startCoord.y;
        this.bounds.y_max = this.startCoord.y;
        for (let i = 0; i < points - 1; i++) {
            const startPoint = this.rockData[i];
            const endPoint = this.rockData[i + 1];
            const diff_x = endPoint.x - startPoint.x;
            const diff_y = endPoint.y - startPoint.y;
            const max_diff = Math.max(Math.abs(diff_x), Math.abs(diff_y));
            console.assert(diff_x === 0 || diff_y === 0);
            this.rockPath.push({
                x: diff_x,
                y: diff_y,
                move: { x: diff_x / max_diff, y: diff_y / max_diff },
                count: max_diff,
            });
            this.bounds.x_min = Math.min(this.bounds.x_min, endPoint.x);
            this.bounds.x_max = Math.max(this.bounds.x_max, endPoint.x);
            this.bounds.y_min = Math.min(this.bounds.y_min, endPoint.y);
            this.bounds.y_max = Math.max(this.bounds.y_max, endPoint.y);
        }
    }
}
