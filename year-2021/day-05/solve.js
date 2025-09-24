/**
 * --- Day 5: Hydrothermal Venture ---
 *
 * https://adventofcode.com/2021/day/5
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const [x1, y1, x2, y2] = x.split(/ -> |,/).map(Number);
        return { x1, y1, x2, y2 };
    });

    const minX = Math.min(...arr.map((x) => [x.x1, x.x2]).flat());
    const maxX = Math.max(...arr.map((x) => [x.x1, x.x2]).flat());
    const minY = Math.min(...arr.map((x) => [x.y1, x.y2]).flat());
    const maxY = Math.max(...arr.map((x) => [x.y1, x.y2]).flat());

    const grid = Array.from({ length: maxX - minX + 1 }, () =>
        Array.from({ length: maxY - minY + 1 }, () => 0)
    );

    const markLine = (line) => {
        const startX = Math.min(line.x1, line.x2) - minX;
        const endX = Math.max(line.x1, line.x2) - minX;
        const startY = Math.min(line.y1, line.y2) - minY;
        const endY = Math.max(line.y1, line.y2) - minY;
        if (startY === endY) {
            for (let i = startX; i <= endX; i++) {
                grid[i][startY]++;
            }
        } else if (startX === endX) {
            for (let j = startY; j <= endY; j++) {
                grid[startX][j]++;
            }
        } else if (startY - endY === startX - endX) {
            const startX2 = line.x1 - minX;
            const startY2 = line.y1 - minY;
            const dx = line.x2 - line.x1 > 0 ? 1 : -1;
            const dy = line.y2 - line.y1 > 0 ? 1 : -1;
            for (let i = 0; i <= endX - startX; i++) {
                grid[startX2 + i * dx][startY2 + i * dy]++;
            }
        } else {
            console.error("Error");
        }
    };

    const arr2 = arr.filter((x) => x.x1 === x.x2 || x.y1 === x.y2);

    for (const line of arr2) {
        markLine(line);
    }

    const partOne = grid.flat().filter((x) => x >= 2).length;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j] = 0;
        }
    }

    for (const line of arr) {
        markLine(line);
    }

    const partTwo = grid.flat().filter((x) => x >= 2).length;

    return { partOne, partTwo };
}
