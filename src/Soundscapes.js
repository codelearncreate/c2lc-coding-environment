// @flow
import CharacterState from "./CharacterState";
import {Frequency, Midi} from 'tone';

// A soundscape defines:
//
// 1. All instruments that will be used.
// 2. A sequence for each action that plays one or more instruments.
// 3. A function to return a note based on the character's position.


// Julien's Pentatonic Tuning, C D F G A. The "center" note is the highest
// point in the row, all other notes descend from there.
const mirroredPentatonicTuning = [
    // <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <-- <---XX---> --> --> --> --> --> --> --> --> --> --> --> --> --> -->
    ["C4","D4","F4","G4","A4","C5","D5","F5","G5","A5","C6","D6","F6","G6","F6","D6","C6","A5","G5","F5","D5","C5","A4","G4","F4","D4"],
    ["A3","C4","D4","F4","G4","A4","C5","D5","F5","G5","A5","C6","D6","F6","D6","C6","A5","G5","F5","D5","C5","A4","G4","F4","D4","C4"],
    ["G3","A3","C4","D4","F4","G4","A4","C5","D5","F5","G5","A5","C6","D6","C6","A5","G5","F5","D5","C5","A4","G4","F4","D4","C4","A3"],
    ["F3","G3","A3","C4","D4","F4","G4","A4","C5","D5","F5","G5","A5","C6","A5","G5","F5","D5","C5","A4","G4","F4","D4","C4","A3","C4"],
    ["D3","F3","G3","A3","C4","D4","F4","G4","A4","C5","D5","F5","G5","A5","G5","F5","D5","C5","A4","G4","F4","D4","C4","A3","G3","F3"],
    ["C3","D3","F3","G3","A3","C4","D4","F4","G4","A4","C5","D5","F5","G5","F5","D5","C5","A4","G4","F4","D4","C4","A3","G3","F3","D3"],
    ["A2","C3","D3","F3","G3","A3","C4","D4","F4","G4","A4","C5","D5","F5","D5","C5","A4","G4","F4","D4","C4","A3","G3","F3","D3","C3"],
    ["G2","A2","C3","D3","F3","G3","A3","C4","D4","F4","G4","A4","C5","D5","C5","A4","G4","F4","D4","C4","A3","G3","F3","D3","C3","A2"],
    ["F2","G2","A2","C3","D3","F3","G3","A3","C4","D4","F4","G4","A4","C5","A4","G4","F4","D4","C4","A3","G3","F3","D3","C3","A2","G2"],
    ["D2","F2","G2","A2","C3","D3","F3","G3","A3","C4","D4","F4","G4","A4","G4","F4","D4","C4","A3","G3","F3","D3","C3","A2","G2","F2"],
    ["C2","D2","F2","G2","A2","C3","D3","F3","G3","A3","C4","D4","F4","G4","F4","D4","C4","A3","G3","F3","D3","C3","A2","G2","F2","D2"],
    ["A1","C2","D2","F2","G2","A2","C3","D3","F3","G3","A3","C4","D4","F4","D4","C4","A3","G3","F3","D3","C3","A2","G2","F2","D2","C2"],
    ["G1","A1","C2","D2","F2","G2","A2","C3","D3","F3","G3","A3","C4","D4","C4","A3","G3","F3","D3","C3","A2","G2","F2","D2","C2","A1"],
    ["F1","G1","A1","C2","D2","F2","G2","A2","C3","D3","F3","G3","A3","C4","A3","G3","F3","D3","C3","A2","G2","F2","D2","C2","A1","G1"],
    ["D1","F1","G1","A1","C2","D2","F2","G2","A2","C3","D3","F3","G3","A3","G3","F3","D3","C3","A2","G2","F2","D2","C2","A1","G1","F1"],
    ["C1","D1","F1","G1","A1","C2","D2","F2","G2","A2","C3","D3","F3","G3","F3","D3","C3","A2","G2","F2","D2","C2","A1","G1","F1","D1"],
    ["A0","C1","D1","F1","G1","A1","C2","D2","F2","G2","A2","C3","D3","F3","D3","C3","A2","G2","F2","D2","C2","A1","G1","F1","D1","C1"],
    ["G0","A0","C1","D1","F1","G1","A1","C2","D2","F2","G2","A2","C3","D3","C3","A2","G2","F2","D2","C2","A1","G1","F1","D1","C1","A0"]
];

function getMirroredPentatonicNoteForState (characterState: CharacterState, offset?: number) : string {
    const baseNoteName = (mirroredPentatonicTuning[characterState.yPos - 1] && mirroredPentatonicTuning[characterState.yPos - 1][characterState.xPos - 1]) || "C-1";
    if (offset) {
        const baseNoteNumber = Midi(baseNoteName).toMidi();
        const offsetNoteName = Midi(baseNoteNumber + offset).toNote();
        return offsetNoteName;
    }

    return baseNoteName;
}

// One step per row, per Sepideh's suggestion.  The top (highest) row is C3.
function getHarmonicNoteForState (characterState: CharacterState, offset?: number) : string {
    const pitch = 48 - characterState.yPos + (offset || 0);
    return Frequency(pitch, "midi").toNote();
}

// Sequences developed working with Julien.
// TODO: type this structure better.
const complexSequences = {
    forward1:  [{ instrumentKey: "marimba"}, {}, { instrumentKey: "drum"}],
    forward2:  [{ instrumentKey: "marimba"}, {}, { instrumentKey: "drum"}, {}, { instrumentKey: "cymbal"}],
    forward3:  [{ instrumentKey: "marimba"}, {}, { instrumentKey: "drum"}, {}, { instrumentKey: "cymbal"}, {}, { instrumentKey: "cymbal"}],
    backward1: [{ instrumentKey: "cymbal"}, { instrumentKey: "marimba"}],
    backward2: [{ instrumentKey: "cymbal"}, {}, { instrumentKey: "drum"}, {}, { instrumentKey: "marimba"}],
    backward3: [{ instrumentKey: "cymbal"}, {}, { instrumentKey: "drum"}, {}, { instrumentKey: "drum"}, {}, { instrumentKey: "marimba"}],
    // TODO: Discuss fleshing this out better.
    left45:    [{ instrumentKey: "drum" }],
    left90:    [{ instrumentKey: "drum" }, { instrumentKey: "drum" }],
    left180:   [{ instrumentKey: "drum" }, { instrumentKey: "drum" }, { instrumentKey: "drum" }],
    right45:   [{ instrumentKey: "cymbal" }],
    right90:   [{ instrumentKey: "cymbal" }, { instrumentKey: "cymbal"}],
    right180:  [{ instrumentKey: "cymbal" }, { instrumentKey: "cymbal"}, { instrumentKey: "cymbal"}]
};

// Simplified sequences that play one note for a single square movement or 45 degree turn, two notes for a two square
// movement or 90 degree turn, and three notes for a three square movement or 180 degree turn.
const singleNoteSequences = {
    forward1:  [{ instrumentKey: "marimba"}],
    forward2:  [{ instrumentKey: "marimba"}, {}, { instrumentKey: "marimba", offset: 12}],
    forward3:  [{ instrumentKey: "marimba"}, {}, { instrumentKey: "marimba", offset: 12}, {}, { instrumentKey: "marimba"}],
    backward1: [{ instrumentKey: "cymbal"}],
    backward2: [{ instrumentKey: "cymbal"}, {}, { instrumentKey: "cymbal"}],
    backward3: [{ instrumentKey: "cymbal"}, {}, { instrumentKey: "cymbal"}, {}, { instrumentKey: "cymbal"}],
    left45:    [{ instrumentKey: "drum" }],
    left90:    [{ instrumentKey: "drum" }, { instrumentKey: "drum" }],
    left180:   [{ instrumentKey: "drum" }, { instrumentKey: "drum" }, { instrumentKey: "drum" }],
    right45:   [{ instrumentKey: "cymbal" }],
    right90:   [{ instrumentKey: "cymbal" }, { instrumentKey: "cymbal"}],
    right180:  [{ instrumentKey: "cymbal" }, { instrumentKey: "cymbal"}, { instrumentKey: "cymbal"}]
};

export const instrumentDefs = {
    bell: {
        baseUrl: "/audio/bell/",
        urls: {
            C1: "C1.mp3",
            C2: "C2.mp3",
            C3: "C3.mp3",
            C4: "C4.mp3",
            C5: "C5.mp3"
        }
    },
    cymbal: {
        baseUrl: "/audio/cymbal/",
        urls: {
            C1: "C4.mp3",
            C2: "C4.mp3",
            C3: "C4.mp3",
            C4: "C4.mp3",
            C5: "C4.mp3"
        }
    },
    drum: {
        baseUrl: "/audio/drum/",
        urls: {
            C1: "C3.mp3",
            C2: "C3.mp3",
            C3: "C3.mp3",
            C4: "C3.mp3",
            C5: "C3.mp3"
        }
    },
    marimba: {
        baseUrl: "/audio/marimba/",
        urls: {
            C1: "C1.mp3",
            C2: "C2.mp3",
            C3: "C3.mp3",
            C4: "C4.mp3",
            C5: "C5.mp3"
        }
    }
}

export const soundscapes = {
    default: {
        sequences: complexSequences,
        getNoteForState: getMirroredPentatonicNoteForState
    },
    forest: {
        sequences: singleNoteSequences,
        getNoteForState: getHarmonicNoteForState
    },
    space: {
        sequences: complexSequences,
        getNoteForState: getMirroredPentatonicNoteForState
    }
}
