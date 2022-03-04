// @flow

import C2lcURLParams from './C2lcURLParams';

test('Given URL query parameters, get param values', () => {
    const urlParams = new C2lcURLParams('?v=0.5&t=dark&p=f1f2&c=00b&d=f3');
    expect(urlParams.getVersion()).toBe('0.5');
    expect(urlParams.getProgram()).toBe('f1f2');
    expect(urlParams.getCharacterState()).toBe('00b');
    expect(urlParams.getTheme()).toBe('dark');
    expect(urlParams.getDisallowedActions()).toBe('f3');
});

test('Given URL query parameters with special characters, get decoded param values', () => {
    const urlParams = new C2lcURLParams('?v=%20%21%224&t=dark&p=%28%22&c=%21%20&d=%28%22');
    expect(urlParams.getVersion()).toBe(' !"4');
    expect(urlParams.getProgram()).toBe('("');
    expect(urlParams.getCharacterState()).toBe('! ');
    expect(urlParams.getTheme()).toBe('dark');
    expect(urlParams.getDisallowedActions()).toBe('("');
});

test('The old allowed actions parameter should be ignored.', () => {
    const urlParams = new C2lcURLParams('?v=0.5&t=dark&p=f1f2&c=00b&a=f3');
    expect(urlParams.getDisallowedActions()).toBe(null);
})