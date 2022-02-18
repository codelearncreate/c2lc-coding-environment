// @flow
import {keyboardEventMatchesKeyDef, findKeyboardEventSequenceMatches, isKeyboardInputSchemeName, KeyboardInputSchemes} from './KeyboardInputSchemes';
import type {KeyDef} from './KeyboardInputSchemes';

it('isKeyboardInputSchemeName', () => {
    expect.assertions(6);
    expect(isKeyboardInputSchemeName('controlalt')).toBe(true);
    expect(isKeyboardInputSchemeName('alt')).toBe(true);
    expect(isKeyboardInputSchemeName('controlshift')).toBe(true);
    expect(isKeyboardInputSchemeName('')).toBe(false);
    expect(isKeyboardInputSchemeName(null)).toBe(false);
    expect(isKeyboardInputSchemeName('UNKNOWN')).toBe(false);
});

it('Should be able to handle unmodified keys', ()  => {
    const keyDef: KeyDef = { key: "?" };

    const unmodifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "?"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(true);

    const controlModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "?", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(false);

    const altModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "?", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle control keys', ()  => {
    const keyDef: KeyDef = { key: "A", ctrlKey: true };

    const controlModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "A", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "A"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);


    const controlAltModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "A", altKey: true, ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlAltModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle alt keys', ()  => {
    const keyDef: KeyDef = { key: "B", altKey: true };

    const altModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "B"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);

    const controlAltModifiedKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true, ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlAltModifiedKeyboardEvent, keyDef)).toBe(false);
});


it('Should be able to handle a complete valid sequence', () => {
    const completeValidSequence = [
        new KeyboardEvent('keydown', { code: "KeyX", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyX"})
    ];

    const result = findKeyboardEventSequenceMatches(completeValidSequence, "alt");
    expect(result).toBe("toggleFeedbackAnnouncements");
});

it('Should be able to handle a complete invalid sequence', () => {
    const completeInvalidSequence = [
        new KeyboardEvent('keydown', { code: "KeyZ", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyX"})
    ];
    const result = findKeyboardEventSequenceMatches(completeInvalidSequence, "alt");
    expect(result).toBe(false);
});

it('Should be able to handle a partial sequence', () => {
    const partialSequence = [
        new KeyboardEvent('keydown', { code: "KeyX", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyA"})
    ];

    const result = findKeyboardEventSequenceMatches(partialSequence, "alt");
    expect(result).toBe("partial");
});

function processSingleLevel (singleLevel, accumulatedSequence) {
    let levelSequences = [];
    // $FlowFixMe: This function generates docs, we don't particularly care about flow coverage here.
    const levelAccumulatedSequence = accumulatedSequence.concat([singleLevel.keyDef]);
    // $FlowFixMe: This function generates docs, we don't particularly care about flow coverage here.
    if (singleLevel.actionName) {
        levelAccumulatedSequence.push(singleLevel.actionName);
        levelSequences.push(levelAccumulatedSequence);
    }
    else {
        // $FlowFixMe: This function generates docs, we don't particularly care about flow coverage here.
        for (const [subEntryKey, subEntryValue] of Object.entries(singleLevel)) {
            if (subEntryKey !== "keyDef" && subEntryKey !== "commandName") {
                const subSequences = processSingleLevel(subEntryValue, levelAccumulatedSequence);
                levelSequences = levelSequences.concat(subSequences);
            }
        }
    }
    return levelSequences;
}

function  displayKeyBindings () {
    let markdown = "";
    for (const [schemeName, keyboardInputScheme] of Object.entries(KeyboardInputSchemes)) {
        markdown += '## ' + schemeName + ' Key Bindings\n\n';
        markdown += '| Keys | Command |\n'
        markdown += '| ---- | ------- |\n'
        // $FlowFixMe: This function generates docs, we don't particularly care about flow coverage here.
        for (const topLevelBinding of Object.values(keyboardInputScheme)) {
            const allSequences = processSingleLevel(topLevelBinding, []);
            const bindingEntries = [];
            for (const sequence of allSequences) {
                const keys = sequence.slice(0, sequence.length - 1);
                const commandName = sequence.slice(-1);
                let bindingText = "";
                for (const keyDef of keys) {
                    if (bindingText.length) {
                        bindingText += ", ";
                    }
                    if (keyDef.ctrlKey) {
                        bindingText += "Ctrl + ";
                    }
                    if (keyDef.altKey) {
                        bindingText += "Alt + "
                    }
                    if (keyDef.shiftKey && ["<",">"].indexOf(keyDef.key) === -1) {
                        bindingText += "Shift + "
                    }
                    bindingText += keyDef.key || (keyDef.code && keyDef.code.replace("Key", ""));
                }
                // $FlowFixMe: This function generates docs, we don't particularly care about flow coverage here.
                bindingEntries.push('| ' + bindingText + ' | ' + commandName + ' |');
            }
            markdown += bindingEntries.sort().join('\n') + '\n';
        }
        markdown += "\n";
    }
    /* eslint-disable-next-line no-console */
    console.log(markdown);
}

// Set this to true to output markdown tables with all key bindings for the docs.
const logKeyBindings = false;
if (logKeyBindings) {
    displayKeyBindings();
}
