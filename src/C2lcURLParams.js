// @flow

export default class C2lcURLParams {
    urlSearchParams: URLSearchParams;

    constructor(query: string) {
        this.urlSearchParams = new URLSearchParams(query);
    }

    getVersion() {
        return this.urlSearchParams.get('v');
    }

    getProgram() {
        return this.urlSearchParams.get('p');
    }

    getCharacterState() {
        return this.urlSearchParams.get('c');
    }

    getTheme() {
        return this.urlSearchParams.get('t');
    }

    getWorld() {
        return this.urlSearchParams.get('w');
    }
}
