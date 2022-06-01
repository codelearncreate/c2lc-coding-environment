// @flow

import { decodeCoordinate, decodeDirection, encodeCoordinate, encodeDirection, extend, isLoopBlock, moveToNextStepDisabled, moveToPreviousStepDisabled, generateEncodedProgramURL, getThemeFromString, getWorldFromString, getStartingPositionFromString, focusByQuerySelector, focusFirstInNodeList, focusLastInNodeList, generateLoopLabel, parseLoopLabel } from './Utils.js';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ProgramSequence from './ProgramSequence';
import { mount, configure } from 'enzyme';
import { makeTestDiv } from './TestUtils';

configure({ adapter: new Adapter()});

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'light', 'default', 'f1=f2=f3', '0ab', 'f1=f2=f3', '1-2')).toBe('?v=version%3D5&t=light&w=default&p=f1%3Df2%3Df3&c=0ab&d=f1%3Df2%3Df3&s=1-2');
    expect(generateEncodedProgramURL('version?5', 'dark', 'space', 'f1?f2?f3', '0aab0c0', 'f1?f2?f3', '16-2')).toBe('?v=version%3F5&t=dark&w=space&p=f1%3Ff2%3Ff3&c=0aab0c0&d=f1%3Ff2%3Ff3&s=16-2');
    expect(generateEncodedProgramURL('version 5', 'contrast', 'forest', 'f1 f2 f3', '0a b c', 'f1 f2 f3', '4-8')).toBe('?v=version%205&t=contrast&w=forest&p=f1%20f2%20f3&c=0a%20b%20c&d=f1%20f2%20f3&s=4-8');
});

test('Test getThemeFromString', () => {
    expect(getThemeFromString('', 'light')).toBe('light');
    expect(getThemeFromString(null, 'light')).toBe('light');
    expect(getThemeFromString('UNKNOWN', 'light')).toBe('light');
    expect(getThemeFromString('light', 'light')).toBe('light');
    expect(getThemeFromString('dark', 'light')).toBe('dark');
    expect(getThemeFromString('contrast', 'light')).toBe('contrast');
    expect(getThemeFromString('gray', 'light')).toBe('gray');
});

test('Test getWorldFromString', () => {
    // World names before 0.9 release
    expect(getWorldFromString('default', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString('forest', 'Sketchpad')).toBe('Jungle');
    expect(getWorldFromString('space', 'Sketchpad')).toBe('Space');

    expect(getWorldFromString('', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString(null, 'Sketchpad')).toBe('Sketchpad');

    expect(getWorldFromString('DeepOcean', 'Sketchpad')).toBe('DeepOcean');
    expect(getWorldFromString('Jungle', 'Sketchpad')).toBe('Jungle');
    expect(getWorldFromString('Sketchpad', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString('Space', 'Sketchpad')).toBe('Space');
});

test('Test getStartingPositionFromString', () => {
    // (1, 1) facing east
    expect(getStartingPositionFromString('aab', 16, 8, 2, 3, 6)).toStrictEqual({ x: 1, y: 1, direction: 2 });
    // Values between min and max
    expect(getStartingPositionFromString('dec', 16, 8, 2, 3, 6)).toStrictEqual({ x: 4, y: 5, direction: 3 });
    // Max values
    expect(getStartingPositionFromString('phg', 16, 8, 2, 3, 6)).toStrictEqual({ x: 16, y: 8, direction: 7 });
    // Empty
    expect(getStartingPositionFromString('', 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
    // Null
    expect(getStartingPositionFromString(null, 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
    // Co-ordingates out of range
    expect(getStartingPositionFromString('zzh', 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
    // Too many characters
    expect(getStartingPositionFromString('aaaa', 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
    // Too few characters
    expect(getStartingPositionFromString('a', 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
    // Bad characters
    expect(getStartingPositionFromString('111', 16, 8, 2, 3, 6)).toStrictEqual({ x: 2, y: 3, direction: 6 });
});

test('Test encodeCoordinate', () => {
    expect.assertions(9);
    expect(encodeCoordinate(0)).toBe('0');
    expect(encodeCoordinate(-1)).toBe('A');
    expect(encodeCoordinate(1)).toBe('a');
    expect(encodeCoordinate(-26)).toBe('Z');
    expect(encodeCoordinate(26)).toBe('z');
    expect(encodeCoordinate(-130)).toBe('Z');
    expect(encodeCoordinate(34)).toBe('z');
    expect(encodeCoordinate(2.8)).toBe('b');
    expect(() => {
        encodeCoordinate(NaN)
    }).toThrowError(/^Bad co-ordinate value: NaN$/);
});

test('Test decodeCoordinate', () => {
    expect.assertions(7);
    expect(decodeCoordinate('0')).toBe(0);
    expect(decodeCoordinate('A')).toBe(-1);
    expect(decodeCoordinate('a')).toBe(1);
    expect(decodeCoordinate('Z')).toBe(-26);
    expect(decodeCoordinate('z')).toBe(26);
    expect(() => {
        decodeCoordinate('')
    }).toThrowError(/^Bad co-ordinate character: ''$/);
    expect(() => {
        decodeCoordinate('!')
    }).toThrowError(/^Bad co-ordinate character: '!'$/);
});


test('encodeDirection', () => {
    expect.assertions(10);
    expect(encodeDirection(0)).toBe('0');
    expect(encodeDirection(1)).toBe('a');
    expect(encodeDirection(2)).toBe('b');
    expect(encodeDirection(3)).toBe('c');
    expect(encodeDirection(4)).toBe('d');
    expect(encodeDirection(5)).toBe('e');
    expect(encodeDirection(6)).toBe('f');
    expect(encodeDirection(7)).toBe('g');
    expect(() => {
        encodeDirection(8)
    }).toThrowError(/^Unrecognized direction 8$/);
    expect(() => {
        encodeDirection(-1)
    }).toThrowError(/^Unrecognized direction -1$/);
});

test('decodeDirection', () => {
    expect.assertions(9);
    expect(decodeDirection('0')).toBe(0);
    expect(decodeDirection('a')).toBe(1);
    expect(decodeDirection('b')).toBe(2);
    expect(decodeDirection('c')).toBe(3);
    expect(decodeDirection('d')).toBe(4);
    expect(decodeDirection('e')).toBe(5);
    expect(decodeDirection('f')).toBe(6);
    expect(decodeDirection('g')).toBe(7);
    expect(() => {
        decodeDirection('3')
    }).toThrowError(/^Unrecognized direction character 3$/);
});

test('Test extend', () => {
    expect(extend({})).toEqual({});
    expect(extend({ a: 0 }, {b: 1}, { c: 2})).toEqual({ a: 0, b: 1, c: 2});
    expect(extend({ foo: { bar: { baz: true }}}, { foo: { new: true, bar: { new: true, baz: false}}})).toEqual({ foo: { new: true, bar: { new: true, baz: false}}});
});

test('Test focusByQuerySelector', () => {
    expect.assertions(2);

    // Test fixture with three focusable elements.
    const testFixture = mount(
        <div>
            <a className="first" href="http://create.weavly.org/">First</a>
            <a className="second" href="http://create.weavly.org/">Second</a>
            <a className="third" href="http://create.weavly.org/">Third</a>
        </div>,
        {attachTo: makeTestDiv()}
    );

    const secondElement = testFixture.find(".second");

    // We should be focused on the body by default.
    // $FlowFixMe: Flow is worried that document.activeElement might not exist.
    expect(document.activeElement.localName).toEqual('body');

    focusByQuerySelector(".second");

    // $FlowFixMe: Flow is worried that document.activeElement might not exist.
    expect(secondElement.html()).toEqual(document.activeElement.outerHTML);

    // make sure to detach after attach
    testFixture.detach();
});

test ('Test focusFirstInNodeList', () => {
    // When called on the empty list, it does nothing and succeeds
    focusFirstInNodeList((([]: any): NodeList<HTMLElement>));

    // When called on a list with 2 elements, it focuses the first one
    const firstFocus = jest.fn();
    const secondFocus = jest.fn();
    focusFirstInNodeList((([
        {
            focus: firstFocus
        },
        {
            focus: secondFocus
        }
    ]: any): NodeList<HTMLElement>));
    expect(firstFocus.mock.calls.length).toBe(1);
    expect(secondFocus.mock.calls.length).toBe(0);
});

test ('Test focusLastInNodeList', () => {
    // When called on the empty list, it does nothing and succeeds
    focusLastInNodeList((([]: any): NodeList<HTMLElement>));

    // When called on a list with 2 elements, it focuses the second one
    const firstFocus = jest.fn();
    const secondFocus = jest.fn();
    focusLastInNodeList((([
        {
            focus: firstFocus
        },
        {
            focus: secondFocus
        }
    ]: any): NodeList<HTMLElement>));
    expect(firstFocus.mock.calls.length).toBe(0);
    expect(secondFocus.mock.calls.length).toBe(1);
});

test('Test generateLoopLabel', () => {
    expect(generateLoopLabel(1)).toEqual('A');
    expect(generateLoopLabel(2)).toEqual('B');
    expect(generateLoopLabel(26)).toEqual('Z');
    expect(generateLoopLabel(27)).toEqual('AA');
    expect(generateLoopLabel(28)).toEqual('AB');
    expect(generateLoopLabel(52)).toEqual('AZ');
    expect(generateLoopLabel(53)).toEqual('BA');
});

test('Test parseLoopLabel', () => {
    expect(parseLoopLabel('A')).toEqual(1);
    expect(parseLoopLabel('B')).toEqual(2);
    expect(parseLoopLabel('Z')).toEqual(26);
    expect(parseLoopLabel('AA')).toEqual(27);
    expect(parseLoopLabel('AB')).toEqual(28);
    expect(parseLoopLabel('AZ')).toEqual(52);
    expect(parseLoopLabel('BA')).toEqual(53);
});

test('Test isLoopBlock', () => {
    expect(isLoopBlock('startLoop')).toEqual(true);
    expect(isLoopBlock('endLoop')).toEqual(true);
    expect(isLoopBlock('forward1')).toEqual(false);
});

describe('Test moveToNextStepDisabled and moveToPreviousStepDisabled', () => {
    test('Single movement', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'}
            ],
            0,
            0,
            new Map()
        );
        expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToNextStepDisabled(programSequence, 0)).toBe(true);
    });

    test('Two movements', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'},
                {block: 'left90'}
            ],
            0,
            0,
            new Map()
        );

        expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToPreviousStepDisabled(programSequence, 1)).toBe(false);

        expect(moveToNextStepDisabled(programSequence, 0)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 1)).toBe(true);
    });

    test('Single empty loop', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'endLoop', label: 'A'},
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToPreviousStepDisabled(programSequence, 1)).toBe(true);

        expect(moveToNextStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToNextStepDisabled(programSequence, 1)).toBe(true);
    });

    test('Loop at start', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'forward1'},
                {block: 'endLoop', label: 'A'},
                {block: 'forward1'}
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToPreviousStepDisabled(programSequence, 1)).toBe(false);
        expect(moveToPreviousStepDisabled(programSequence, 2)).toBe(true);
        expect(moveToPreviousStepDisabled(programSequence, 3)).toBe(false);

        expect(moveToNextStepDisabled(programSequence, 0)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 1)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 2)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 3)).toBe(true);
    });

    test('Loop at end', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'},
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'forward1'},
                {block: 'endLoop', label: 'A'}
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
        expect(moveToPreviousStepDisabled(programSequence, 1)).toBe(false);
        expect(moveToPreviousStepDisabled(programSequence, 2)).toBe(false);
        expect(moveToPreviousStepDisabled(programSequence, 3)).toBe(false);

        expect(moveToNextStepDisabled(programSequence, 0)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 1)).toBe(true);
        expect(moveToNextStepDisabled(programSequence, 2)).toBe(false);
        expect(moveToNextStepDisabled(programSequence, 3)).toBe(true);
    });
});
