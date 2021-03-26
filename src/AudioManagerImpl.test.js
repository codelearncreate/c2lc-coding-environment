// @flow

import {getNoteForState} from './AudioManagerImpl';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import {Frequency} from 'tone';

function arrayToPaddedRowString (array: Array<any>) : string {
    const paddedArray = [];
    array.forEach((item) => {
        paddedArray.push(item.toString().padStart(5, " "));
    });
    return "| " + paddedArray.join(" | ") + " |";
}

function logTuning (noteTable: Array<Array<string>>) {
    const tableStringSegments = [];
    // Column Headings
    const colHeadings = ["", "A -3", "A -2", "A -1", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "Q +1", "Q +2", "Q +3"];
    tableStringSegments.push(arrayToPaddedRowString(colHeadings));
    // GfM table syntax.
    const tableDividers = new Array(colHeadings.length);
    tableDividers.fill("-----");
    tableStringSegments.push(arrayToPaddedRowString(tableDividers));

    for (let row = 0; row < noteTable.length; row++) {
        const rowEntries = noteTable[row];
        // Row Heading
        const rowStringSegments = [ (row - 2) ];
        for (let col = 0; col < rowEntries.length; col ++) {
            const singleNote: string = rowEntries[col];
            rowStringSegments.push(singleNote);
        }
        tableStringSegments.push(arrayToPaddedRowString(rowStringSegments));
    }
    console.log(tableStringSegments.join("\n"));
}

test("Returns a sensible note range for every supported character position.", () => {
    // 4 rows "in bounds" on either side of the centre plus testing three "out of bounds" rows on each side.
    const minRow = -7;
    const maxRow = 7;

    // 9 columns "in bounds" above and below the centre plus testing three "out of bounds" columns on each side.
    const minCol = -12;
    const maxCol = 12;

    // noteTable [row][col] = singlePitchString;
    const noteTable = [];

    const sceneDimensions = new SceneDimensions(1, 1);

    for (let row = minRow; row <= maxRow; row++) {
        let maxPitch = 0;
        let minPitch = 127;
        const rowEntries = [];
        noteTable.push(rowEntries);

        for (let col = minCol; col <= maxCol; col++) {
            const noteForState = getNoteForState(new CharacterState(col, row, 0, [], sceneDimensions));
            rowEntries.push(noteForState);

            const midiNote: number = Frequency(noteForState).toMidi();
            maxPitch = Math.max(maxPitch, midiNote);
            minPitch = Math.min(minPitch, midiNote);
            expect(midiNote).toBeGreaterThanOrEqual(0);
            expect(midiNote).toBeLessThanOrEqual(127);
        }

        const pitchRange = maxPitch - minPitch;
        expect(pitchRange).toBeGreaterThanOrEqual(0);
        expect(pitchRange).toBeLessThanOrEqual(12);
    }

    logTuning(noteTable);
});
