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
    const colHeadings = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U","V","W","X","Y","Z"];
    tableStringSegments.push(arrayToPaddedRowString(colHeadings));
    // GfM table syntax.
    const tableDividers = new Array(colHeadings.length);
    tableDividers.fill("-----");
    tableStringSegments.push(arrayToPaddedRowString(tableDividers));

    for (let row = 0; row < noteTable.length; row++) {
        const rowEntries = noteTable[row];
        // Row Heading
        const rowStringSegments = [ row + 1 ];
        for (let col = 0; col < rowEntries.length; col ++) {
            const singleNote: string = rowEntries[col];
            rowStringSegments.push(singleNote);
        }
        tableStringSegments.push(arrayToPaddedRowString(rowStringSegments));
    }
    console.log(tableStringSegments.join("\n"));
}

test("Returns a sensible note range for every supported character position.", () => {
    const minRow = 1;
    const maxRow = 16;

    const minCol = 1;
    const maxCol = 26;

    // noteTable [row][col] = singlePitchString;
    const noteTable = [];

    const sceneDimensions = new SceneDimensions(1, 26, 1, 16);

    for (let row = minRow; row <= maxRow; row++) {
        const rowEntries = [];
        noteTable.push(rowEntries);

        for (let col = minCol; col <= maxCol; col++) {
            const noteForState = getNoteForState(new CharacterState(col, row, 0, [], sceneDimensions));
            rowEntries.push(noteForState);

            const midiNote: number = Frequency(noteForState).toMidi();
            expect(midiNote).toBeGreaterThanOrEqual(0);
            expect(midiNote).toBeLessThanOrEqual(127);
        }
    }

    logTuning(noteTable);
});
