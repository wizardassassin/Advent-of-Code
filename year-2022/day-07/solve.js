/**
 * --- Day 7: No Space Left On Device ---
 *
 * https://adventofcode.com/2022/day/7
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n");

    const location = [];

    const dirMap = new Map();

    const getPath = () => location.reduce((a, b) => a + "/" + b);

    for (const line of arr) {
        if (line.startsWith("$ cd ")) {
            const appendLocation = line.slice(5);
            if (appendLocation == "..") {
                location.pop();
            } else {
                location.push(appendLocation);
                dirMap.set(getPath(), { size: null, items: [] });
            }
        } else if (line.startsWith("$ ls")) {
            //? $ ls command is intentionally not processed here.
        } else if (line.startsWith("dir ")) {
            const dirName = line.slice(4);
            const path = getPath();
            dirMap.get(path).items.push({
                isDir: true,
                size: null,
                path: path + "/" + dirName,
            });
        } else {
            const path = getPath();
            const [size, name] = line.split(" ");
            dirMap.get(path).items.push({
                isDir: false,
                size: Number(size),
                path: path + "/" + name,
            });
        }
    }

    const getSize = (key) => {
        const value = dirMap.get(key);
        if (value.size !== null) return value.size;
        let sum = 0;
        for (const item of value.items) {
            if (item.isDir) {
                sum += getSize(item.path);
            } else {
                sum += item.size;
            }
        }
        value.size = sum;
        return sum;
    };

    for (const [key] of dirMap) {
        getSize(key);
    }

    let sum = 0;
    const dir_size_max = 100000;
    for (const [, value] of dirMap) {
        if (value.size <= dir_size_max) sum += value.size;
    }

    const partOne = sum;

    const total_space = 70000000;
    const needed_space = 30000000;

    const currentSpace = dirMap.get("/").size;
    const clearSpace = needed_space - (total_space - currentSpace);

    console.assert(clearSpace > 0);

    let clearSize = Infinity;
    for (const [, value] of dirMap) {
        if (value.size >= clearSpace) {
            if (value.size < clearSize) {
                clearSize = value.size;
            }
        }
    }

    const partTwo = clearSize;

    return { partOne, partTwo };
}
