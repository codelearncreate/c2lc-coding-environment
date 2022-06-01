// @flow

import {keyboardEventMatchesKeyDef, findKeyboardEventSequenceMatches, isKeyboardInputSchemeName} from './KeyboardInputSchemes';

it('isKeyboardInputSchemeName', () => {
    expect.assertions(5);
    expect(isKeyboardInputSchemeName('controlalt')).toBe(true);
    expect(isKeyboardInputSchemeName('alt')).toBe(true);
    expect(isKeyboardInputSchemeName('')).toBe(false);
    expect(isKeyboardInputSchemeName(null)).toBe(false);
    expect(isKeyboardInputSchemeName('UNKNOWN')).toBe(false);
});

it('Should be able to handle unmodified keys', ()  => {
    const keyDef = { key: "?" };

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(true);

    const controlModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(false);

    const altModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle control keys', ()  => {
    const keyDef = { key: "A", ctrlKey: true };

    const controlModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);


    const controlAltModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A", altKey: true, ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlAltModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle alt keys', ()  => {
    const keyDef = { key: "B", altKey: true };

    const altModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);

    const controlAltModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true, ctrlKey: true});
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
        new KeyboardEvent('keydown', { code: "KeyM"})
    ];

    const result = findKeyboardEventSequenceMatches(partialSequence, "alt");
    expect(result).toBe("partial");
});
