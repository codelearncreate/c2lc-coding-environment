// @flow

import { extend, generateEncodedProgramURL, getThemeFromString, getWorldFromString, focusByQuerySelector, generateLoopLabel, parseLoopLabel, overlayModifierKeys } from './Utils.js';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { makeTestDiv } from './TestUtils';

configure({ adapter: new Adapter()});

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'light', 'default', 'f1=f2=f3', '0ab', 'f1=f2=f3')).toBe('?v=version%3D5&t=light&w=default&p=f1%3Df2%3Df3&c=0ab&d=f1%3Df2%3Df3');
    expect(generateEncodedProgramURL('version?5', 'dark', 'space', 'f1?f2?f3', '0aab0c0', 'f1?f2?f3')).toBe('?v=version%3F5&t=dark&w=space&p=f1%3Ff2%3Ff3&c=0aab0c0&d=f1%3Ff2%3Ff3');
    expect(generateEncodedProgramURL('version 5', 'contrast', 'forest', 'f1 f2 f3', '0a b c', 'f1 f2 f3')).toBe('?v=version%205&t=contrast&w=forest&p=f1%20f2%20f3&c=0a%20b%20c&d=f1%20f2%20f3');
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

test('generateLoopLabel', () => {
    expect(generateLoopLabel(1)).toEqual('A');
    expect(generateLoopLabel(2)).toEqual('B');
    expect(generateLoopLabel(26)).toEqual('Z');
    expect(generateLoopLabel(27)).toEqual('AA');
    expect(generateLoopLabel(28)).toEqual('AB');
    expect(generateLoopLabel(52)).toEqual('AZ');
    expect(generateLoopLabel(53)).toEqual('BA');
});

test('parseLoopLabel', () => {
    expect(parseLoopLabel('A')).toEqual(1);
    expect(parseLoopLabel('B')).toEqual(2);
    expect(parseLoopLabel('Z')).toEqual(26);
    expect(parseLoopLabel('AA')).toEqual(27);
    expect(parseLoopLabel('AB')).toEqual(28);
    expect(parseLoopLabel('AZ')).toEqual(52);
    expect(parseLoopLabel('BA')).toEqual(53);
});

test('Overlay modifiers on a key binding definition (shallow)', () => {
    const modifiedBinding = overlayModifierKeys({ escape: { keyDef: { code: "esc" }}}, { altKey: true});
    expect(modifiedBinding).toEqual({ escape: { keyDef: { code: "esc", altKey: true}}});
});

test('Overlay modifiers on a key binding definition (deep)', () => {
    const modifiedBinding = overlayModifierKeys({ escape: { keyDef: { code: "esc", x: { keyDef: { code: "x"}} }}}, { ctrlKey: true}, true);
    expect(modifiedBinding).toEqual({ escape: { keyDef: { code: "esc", ctrlKey: true, x: { keyDef: { code: "x", ctrlKey: true}}}}});
});