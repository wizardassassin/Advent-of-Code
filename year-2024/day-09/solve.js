/**
 * --- Day 9: Disk Fragmenter ---
 *
 * https://adventofcode.com/2024/day/9
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const fileSystem = input.split("");
    const fileSystemExpanded = fileSystem.map((x, i) => {
        const type = i % 2 === 0 ? "FILE" : "SPACE";
        const id = i % 2 === 0 ? i / 2 : -1;
        return { type, id, size: Number(x) };
    });

    const compactFileSystem = (fileSystem) => {
        fileSystem = structuredClone(fileSystem);
        const totalSize = fileSystem
            .map((x) => x.size)
            .reduce((a, b) => a + b, 0);
        let start = 0;
        let end = fileSystem.length - 1;

        const newFileSystem = [];

        while (start < end) {
            const file1 = fileSystem[start];
            if (file1.type === "FILE") {
                newFileSystem.push(file1);
                start++;
                continue;
            }
            const file2 = fileSystem[end];
            if (file2.type === "SPACE") {
                end--;
                continue;
            }
            const minSize = Math.min(file1.size, file2.size);
            newFileSystem.push({ ...file2, size: minSize });
            file1.size -= minSize;
            file2.size -= minSize;
            if (file1.size === 0) start++;
            if (file2.size === 0) end--;
        }

        if (start < fileSystem.length) {
            const file = fileSystem[start];
            if (file.size !== 0 && file.id === newFileSystem.at(-1)?.id) {
                newFileSystem.at(-1).size += file.size;
                file.size = 0;
            }
        }
        while (start < fileSystem.length) {
            const file = fileSystem[start];
            if (file.type === "FILE") {
                console.assert(file.size === 0);
            }
            start++;
        }

        const remainingSpace =
            totalSize -
            newFileSystem.map((x) => x.size).reduce((a, b) => a + b, 0);
        if (remainingSpace !== 0)
            newFileSystem.push({ type: "SPACE", id: -1, size: remainingSpace });

        return newFileSystem;
    };

    const newFileSystem = compactFileSystem(fileSystemExpanded);

    const computeChecksum = (fileSystem) => {
        let pos = 0;
        let sum = 0;
        for (let i = 0; i < fileSystem.length; i++) {
            const file = fileSystem[i];
            if (file.type !== "FILE") {
                pos += file.size;
                continue;
            }
            for (let j = 0; j < file.size; j++) {
                sum += file.id * pos;
                pos++;
            }
        }
        return sum;
    };

    const compactFileSystem2 = (fileSystem) => {
        fileSystem = structuredClone(fileSystem);
        let end = fileSystem.length - 1;

        const spaceLeftOf = (index) => {
            const currfile = fileSystem[index];
            for (let i = 0; i < index; i++) {
                const file = fileSystem[i];
                if (file.type === "SPACE" && file.size >= currfile.size)
                    return i;
            }
            return -1;
        };

        while (end >= 0) {
            const file = fileSystem[end];
            if (file.type === "SPACE") {
                end--;
                continue;
            }
            const spaceIndex = spaceLeftOf(end);
            if (spaceIndex === -1) {
                end--;
                continue;
            }
            const spaceFile = fileSystem[spaceIndex];
            spaceFile.type = "FILE";
            spaceFile.id = file.id;
            file.type = "SPACE";
            file.id = -1;
            if (spaceFile.size !== file.size) {
                const sizeDiff = spaceFile.size - file.size;
                spaceFile.size = file.size;
                fileSystem.splice(spaceIndex + 1, 0, {
                    type: "SPACE",
                    id: -1,
                    size: sizeDiff,
                });
                end++;
            }
            end--;
        }

        return fileSystem;
    };

    const newFileSystem2 = compactFileSystem2(fileSystemExpanded);

    // filesystem could contain sequential space files

    const partOne = computeChecksum(newFileSystem);
    const partTwo = computeChecksum(newFileSystem2);

    return { partOne, partTwo };
}
