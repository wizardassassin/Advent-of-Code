/**
 * --- Day 18: Boiling Boulders ---
 *
 * https://adventofcode.com/2022/day/18
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const coords = input
        .split("\n")
        .map((x) => x.split(",").map((x2) => Number(x2)));

    const minCoord = Math.min(...coords.flat());
    const maxCoord = Math.max(...coords.flat());

    const range = maxCoord - minCoord + 1;

    const diff = 1 - minCoord;

    const points = range * 2 + 1;

    const surfaces = Array.from({ length: points }, () =>
        Array.from({ length: points }, () =>
            Array.from({ length: points }, () => 0)
        )
    );

    let topCoord = coords[0].map((x) => 2 * (x + diff) - 1);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (const [x, y, z] of coords) {
        const x2 = 2 * (x + diff) - 1;
        const y2 = 2 * (y + diff) - 1;
        const z2 = 2 * (z + diff) - 1;
        if (x2 <= topCoord[0]) {
            topCoord = [x2, y2, z2];
        }
        minX = Math.min(minX, x2);
        maxX = Math.max(maxX, x2);
        minY = Math.min(minY, y2);
        maxY = Math.max(maxY, y2);
        minZ = Math.min(minZ, z2);
        maxZ = Math.max(maxZ, z2);

        surfaces[x2][y2][z2]--;
        surfaces[x2 + 1][y2][z2]++;
        surfaces[x2 - 1][y2][z2]++;
        surfaces[x2][y2 + 1][z2]++;
        surfaces[x2][y2 - 1][z2]++;
        surfaces[x2][y2][z2 + 1]++;
        surfaces[x2][y2][z2 - 1]++;
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    let surfaceCount = 0;

    for (const val of surfaces.flat(2)) {
        if (val === 1) surfaceCount++;
    }

    const partOne = surfaceCount;

    let surfaceType = [-1, 0, 0];

    const invert = (coord) => coord.map((x) => -x);
    const add = (...coords) =>
        coords.reduce((a, b) => a.map((x, i) => x + b[i]));
    const scale = (coord, scalar) => coord.map((x) => scalar * x);
    const value = (coord) => surfaces[coord[0]]?.[coord[1]]?.[coord[2]];
    const setValue = (coord, value) =>
        (surfaces[coord[0]][coord[1]][coord[2]] = value);

    const getNext = (cube, side, check) => {
        const diagCube = add(cube, scale(side, 2), scale(check, 2));
        if (value(diagCube) === -1) {
            return [diagCube, invert(check)];
        }
        const sideCube = add(cube, scale(check, 2));
        if (value(sideCube) === -1) {
            return [sideCube, side];
        }
        return [cube, check];
    };

    const getChecks = (coord) => {
        const checkX = [
            [1, 0, 0],
            [-1, 0, 0],
        ];
        const checkY = [
            [0, 1, 0],
            [0, -1, 0],
        ];
        const checkZ = [
            [0, 0, 1],
            [0, 0, -1],
        ];
        if (coord[0] !== 0) {
            return [...checkY, ...checkZ];
        }
        if (coord[1] !== 0) {
            return [...checkX, ...checkZ];
        }
        if (coord[2] !== 0) {
            return [...checkX, ...checkY];
        }
        throw new Error("Invalid Coord");
    };

    const getNextValues = ([cube, side]) => {
        const checks = getChecks(side);
        const nextVals = checks
            .map((check) => getNext(cube, side, check))
            .filter(([cube2, side2]) => value(add(cube2, side2)) === 1);
        setValue(add(cube, side), -10);
        for (const [cube2, side2] of nextVals) {
            setValue(add(cube2, side2), -10);
        }
        return nextVals;
    };

    const isFloating = ([i, j, k]) =>
        surfaces[i + 1]?.[j]?.[k] === 1 &&
        surfaces[i - 1]?.[j]?.[k] === 1 &&
        surfaces[i]?.[j + 1]?.[k] === 1 &&
        surfaces[i]?.[j - 1]?.[k] === 1 &&
        surfaces[i]?.[j]?.[k + 1] === 1 &&
        surfaces[i]?.[j]?.[k - 1] === 1;

    const checkFloating = ([cube, side]) => {
        const floatCube = add(cube, scale(side, 4));
        if (!isFloating(floatCube)) {
            return false;
        }
        const [i, j, k] = floatCube;
        surfaces[i + 1][j][k] = -10;
        surfaces[i - 1][j][k] = -10;
        surfaces[i][j + 1][k] = -10;
        surfaces[i][j - 1][k] = -10;
        surfaces[i][j][k + 1] = -10;
        surfaces[i][j][k - 1] = -10;
        return true;
    };

    const outside = [[topCoord, surfaceType]];

    let outerSurface = 0;

    while (outside.length !== 0) {
        outerSurface++;
        const outSurface = outside.shift();
        // there's only one outside float
        if (checkFloating(outSurface)) outerSurface += 6;
        const nextVals = getNextValues(outSurface);
        outside.push(...nextVals);
    }

    const partTwo = outerSurface;

    return { partOne, partTwo };
}
