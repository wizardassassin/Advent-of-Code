/**
 * --- Day 7: Camel Cards ---
 *
 * https://adventofcode.com/2023/day/7
 *
 * @param {string} input Text Input
 * @returns Problem Solution
 */
export default function solve(input) {
    const arr = input.split("\n").map((x) => {
        const [hand, bid] = x.split(" ");
        return { hand, bid: Number(bid) };
    });

    const getCardFreq = (hand) => {
        /** @type {{ card:string; count:number; }[]} */
        const cardFreq = [];
        for (const card of hand) {
            /** @type {{ card:string; count:number; }} */
            const cardEntry =
                cardFreq.find((x) => x.card === card) ??
                (() => {
                    const newEntry = { card: card, count: 0 };
                    cardFreq.push(newEntry);
                    return newEntry;
                })();
            cardEntry.count++;
        }
        return cardFreq;
    };

    const getType = (hand) => {
        const cardFreq = getCardFreq(hand);
        const maxVal = Math.max(...cardFreq.map((x) => x.count));
        // good code
        if (cardFreq.length === 1 && maxVal === 5) return 6;
        if (cardFreq.length === 2 && maxVal === 4) return 5;
        if (cardFreq.length === 2 && maxVal === 3) return 4;
        if (cardFreq.length === 3 && maxVal === 3) return 3;
        if (cardFreq.length === 3 && maxVal === 2) return 2;
        if (cardFreq.length === 4 && maxVal === 2) return 1;
        // if (cardFreq.length === 5 && maxVal === 5)
        return 0;
    };

    const rankings = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "T",
        "J",
        "Q",
        "K",
        "A",
    ];

    const handCompare = (hand_a, hand_b, rankings) => {
        for (let i = 0; i < hand_a.length; i++) {
            const val =
                rankings.indexOf(hand_a[i]) - rankings.indexOf(hand_b[i]);
            if (val !== 0) return val;
        }
        return 0;
    };

    const arr2 = arr.slice();
    arr2.sort((a, b) => {
        return (
            getType(a.hand) - getType(b.hand) ||
            handCompare(a.hand, b.hand, rankings)
        );
    });

    const partOne = arr2.reduce((a, b, i) => a + b.bid * (i + 1), 0);

    const rankings2 = [
        "J",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "T",
        "Q",
        "K",
        "A",
    ];

    const getType2 = (a) => {
        const freqA = getCardFreq(a.hand.replace(/J/g, ""));
        if (freqA.length === 0) return getType(a.hand);
        const maxCardCountA = Math.max(...freqA.map((x) => x.count));
        const maxCardA = freqA.find((x) => x.count === maxCardCountA);
        const typeA = getType(a.hand.replace(/J/g, maxCardA.card));
        return typeA;
    };

    const arr3 = arr.slice();
    arr3.sort((a, b) => {
        return (
            getType2(a) - getType2(b) || handCompare(a.hand, b.hand, rankings2)
        );
    });

    const partTwo = arr3.reduce((a, b, i) => a + b.bid * (i + 1), 0);

    return { partOne, partTwo };
}
