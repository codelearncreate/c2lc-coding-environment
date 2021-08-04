// @flow

import { extend, generateEncodedProgramURL, getThemeFromString, getWorldFromString } from './Utils.js';

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'light', 'default', 'f1=f2=f3', '0ab', 'f1=f2=f3')).toBe('?v=version%3D5&t=light&w=default&p=f1%3Df2%3Df3&c=0ab&a=f1%3Df2%3Df3');
    expect(generateEncodedProgramURL('version?5', 'dark', 'space', 'f1?f2?f3', '0aab0c0', 'f1?f2?f3')).toBe('?v=version%3F5&t=dark&w=space&p=f1%3Ff2%3Ff3&c=0aab0c0&a=f1%3Ff2%3Ff3');
    expect(generateEncodedProgramURL('version 5', 'contrast', 'forest', 'f1 f2 f3', '0a b c', 'f1 f2 f3')).toBe('?v=version%205&t=contrast&w=forest&p=f1%20f2%20f3&c=0a%20b%20c&a=f1%20f2%20f3');
});

test('Test getThemeFromString', () => {
    expect(getThemeFromString('', 'light')).toBe('light');
    expect(getThemeFromString(null, 'light')).toBe('light');
    expect(getThemeFromString('light', 'light')).toBe('light');
    expect(getThemeFromString('dark', 'light')).toBe('dark');
    expect(getThemeFromString('contrast', 'light')).toBe('contrast');
    expect(getThemeFromString('gray', 'light')).toBe('gray');
});

test('Test getWorldFromString', () => {
    expect(getWorldFromString('', 'default')).toBe('default');
    expect(getWorldFromString(null, 'default')).toBe('default');
    expect(getWorldFromString('default', 'default')).toBe('default');
    expect(getWorldFromString('space', 'default')).toBe('space');
    expect(getWorldFromString('forest', 'default')).toBe('forest');
});

test('Test extend', () => {
    expect(extend({})).toEqual({});
    expect(extend({ a: 0 }, {b: 1}, { c: 2})).toEqual({ a: 0, b: 1, c: 2});
    expect(extend({ foo: { bar: { baz: true }}}, { foo: { new: true, bar: { new: true, baz: false}}})).toEqual({ foo: { new: true, bar: { new: true, baz: false}}});
});