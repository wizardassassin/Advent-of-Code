/**
 * --- Day 5: If You Give A Seed A Fertilizer ---
 *
 * https://adventofcode.com/2023/day/5
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n\n");
    const start = arr[0]
        .split(": ")[1]
        .split(" ")
        .map((x) => Number(x));
    const maps = arr
        .slice(1)
        .map((x) => x.split("\n"))
        .map((x) =>
            x
                .slice(1)
                .map((x) => x.split(" ").map((x) => Number(x)))
                .map((x) => ({ dest: x[0], src: x[1], range: x[2] }))
        );

    const inMap = (map, v) => v >= map.src && v <= map.src + map.range;

    const getValue = (seed) => {
        let seedValue = seed;
        for (const map_v of maps) {
            let foundMap = false;
            for (const map of map_v) {
                if (inMap(map, seedValue)) {
                    foundMap = true;
                    seedValue = map.dest + seedValue - map.src;
                    break;
                }
            }
        }
        return seedValue;
    };

    let minValue = Infinity;
    for (const seed of start) {
        minValue = Math.min(minValue, getValue(seed));
    }

    const partOne = minValue;

    let start2 = [];

    for (let i = 0; i < start.length; i += 2) {
        start2.push({ start: start[i], range: start[i + 1] });
    }

    const mapMaps = maps.map((x) =>
        x.map((x2) => new SetMap(x2.src, x2.src + x2.range, x2.dest - x2.src))
    );
    const startMaps = start2.map(
        (x) => new SetMap(x.start, x.start + x.range, 0)
    );
    /**
     *
     * @param {SetMap[]} aMap
     * @returns
     */
    const mapDuplicate = (aMap) =>
        aMap
            .slice()
            .sort((a, b) => a.srcMin - b.srcMin || a.srcMax - b.srcMax)
            .some((x, i, sMap) =>
                i + 1 === sMap.length
                    ? false
                    : x.srcMin === sMap[i + 1].srcMin &&
                      x.srcMax === sMap[i + 1].srcMax
            );
    // let count = 0;
    for (const map2 of mapMaps) {
        // console.log(count++);
        const unions = startMaps.map((x) =>
            map2.map((x2) => x.union(x2)).filter((x2) => x2.isValid())
        );
        const subtracts = startMaps.map((x, i) => x.subtract(unions[i]));
        startMaps.splice(0, startMaps.length);
        startMaps.push(
            ...[unions, subtracts].flat(2).map((x) => x.normalize())
        );
        // console.log(startMaps);
        // if (mapDuplicate(startMaps)) {
        //     debugger;
        // }
        console.assert(!mapDuplicate(startMaps));
        let a = 1;
    }

    startMaps.sort((a, b) => a.srcMin - b.srcMin);
    // console.log(startMaps);

    const partTwo = Math.min(...startMaps.map((x) => x.srcMin));

    return { partOne, partTwo };
}

class SetMap {
    srcMin;
    srcMax;
    destDiff;
    parent;
    copyData;
    constructor(srcMin, srcMax, destDiff) {
        // if (srcMin === 14149303) debugger;
        this.srcMin = srcMin;
        this.srcMax = srcMax;
        this.destDiff = destDiff;
        this.parent = null;
        this.copyData = 0;
    }
    /**
     *
     * @param {SetMap} otherSet
     */
    union(otherSet) {
        const a = new SetMap(
            Math.max(this.srcMin, otherSet.srcMin),
            Math.min(this.srcMax, otherSet.srcMax),
            otherSet.destDiff
        );
        a.parent = this;
        a.copyData = 10;
        return a;
    }
    /**
     *
     * @param {SetMap[]} otherSets[]
     */
    subtract(otherSets) {
        let setRanges = [this.copy()];
        otherSets = otherSets.slice().sort();
        for (const set of otherSets) {
            setRanges = setRanges
                .map((x) => x.subtractOne(set))
                .flat()
                .filter((x) => x.isValid());
        }
        return setRanges;
    }
    /**
     *
     * @param {SetMap} otherSet
     */
    subtractOne(otherSet) {
        if (!this.hasIntersect(otherSet)) return [this.copy()]; // the missing line of code that took days to discover
        const a = new SetMap(this.srcMin, otherSet.srcMin, this.destDiff);
        a.parent = this;
        a.copyData = 100;
        const b = new SetMap(otherSet.srcMax, this.srcMax, this.destDiff);
        b.parent = this;
        b.copyData = 200;
        return [a, b];
    }
    /**
     *
     * @param {SetMap} otherSet
     */
    hasIntersect(otherSet) {
        return this.union(otherSet).isValid();
    }
    isValid() {
        return this.srcMax > this.srcMin;
    }
    normalize() {
        // if (this.srcMin + this.destDiff === 14149303) debugger;
        // this.srcMin += this.destDiff;
        // this.srcMax += this.destDiff;
        // this.destDiff = 0;
        // return this;
        const a = new SetMap(
            this.srcMin + this.destDiff,
            this.srcMax + this.destDiff,
            0
        );
        a.parent = this;
        a.copyData = 300;
        return a;
    }
    copy() {
        const a = new SetMap(this.srcMin, this.srcMax, this.destDiff);
        a.parent = this;
        a.copyData = 1;
        return a;
    }
}
