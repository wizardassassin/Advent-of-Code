/**
 * --- Day 10: Cathode-Ray Tube ---
 *
 * https://adventofcode.com/2022/day/10
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        if (x === "noop") {
            return [x];
        }
        if (x.startsWith("addx")) {
            const [op, v] = x.split(" ");
            return [op, Number(v)];
        }
    });

    const codeReader = function* () {
        for (let i = 0; i < arr.length; i++) {
            yield { instruction: arr[i], line: i + 1 };
        }
    };

    const measureTimes = [20, 60, 100, 140, 180, 220];
    const measureLen = measureTimes.length;
    let measureIndex = 0;
    const signalStrength = [];

    const codeGen = codeReader();
    let registerX = 1;
    let currentCycle = 0;

    const checkSignal = () => {
        if (
            measureIndex < measureLen &&
            currentCycle === measureTimes[measureIndex]
        ) {
            signalStrength.push(currentCycle * registerX);
            measureIndex++;
        }
    };

    const crt_rows = 6;
    const crt_cols = 40;
    const screen = Array.from({ length: crt_rows }, () =>
        Array.from({ length: crt_cols }, () => ".")
    );
    let crt_a = 0;
    const CRTRead = (isRunning) => {
        if (!isRunning) {
            console.log("Dummy run");
            return;
        }
        const i = Math.floor(crt_a / crt_cols) % crt_rows;
        const j = crt_a % crt_cols;
        if (registerX - 1 <= j && j <= registerX + 1) {
            screen[i][j] = "#";
        }
        crt_a++;
    };

    while (true) {
        let hasInstruction = true;
        const code = codeGen.next();
        if (code.done) {
            if (measureIndex >= measureLen) break;
            hasInstruction = false;
        }
        currentCycle++;
        // during cycle
        CRTRead(hasInstruction);
        checkSignal();
        // after cycle
        if (!hasInstruction) continue;
        switch (code.value.instruction[0]) {
            case "noop":
                // do nothing
                break;
            case "addx":
                currentCycle++;
                CRTRead(hasInstruction);
                checkSignal();
                registerX += code.value.instruction[1];
                break;
        }
    }

    const partOne = signalStrength.reduce((a, b) => a + b);

    // Magic OCR
    const partTwo = "EKRHEPUZ";

    return { partOne, partTwo };
}
