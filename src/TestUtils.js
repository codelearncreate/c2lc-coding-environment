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

export { makeBlurEvent, makeChangeEvent, makeKeyDownEvent };
