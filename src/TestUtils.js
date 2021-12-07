// @flow

function makeBlurEvent(currentTarget: {}): {} {
    return {
        preventDefault: () => {},
        currentTarget
    };
}

function makeChangeEvent(currentTarget: {}): {} {
    return {
        preventDefault: () => {},
        currentTarget
    };
}

function makeKeyDownEvent(currentTarget: {}, key: string): {} {
    return {
        preventDefault: () => {},
        currentTarget,
        key
    };
}

function makeTestDiv() {
    const div = document.createElement('div');
    // $FlowFixMe: document.body may be null, no need to handle
    document.body.appendChild(div);
    return div;
}

export { makeBlurEvent, makeChangeEvent, makeKeyDownEvent, makeTestDiv };
