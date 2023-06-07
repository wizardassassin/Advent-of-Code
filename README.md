# Advent-of-Code

Advent of Code... In JavaScript!

My own solutions for [Advent of Code](https://adventofcode.com/).

## Initial Setup

Make sure to have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed.

Clone the repository

```bash
git clone https://github.com/wizardassassin/Advent-of-Code.git
cd Advent-of-Code
```

Install the dependencies

```bash
npm i
```

### Running Solutions

Running a single solution

The example runs the solution for day 1, year 2022.

```bash
node . debug 2022 1
```

Example output

```json
{
    "year": 2022,
    "day": 1,
    "output": { "PartOne": 73211, "PartTwo": 213958 },
    "duration": "0.3455ms"
}
```

Running all solutions

The results are aggregated into a json file. The duration is in milliseconds.

```bash
node . run
```

### Creating/Deleting a Day

Creates the template files for day 1, year 2023.

```bash
node . create 2023 1
```

To delete a day or year, manually remove the respective files and folders, and prune the metadata file.

```bash
rm -r year-2023/day-01
rm -d year-2023
node . prune
```
