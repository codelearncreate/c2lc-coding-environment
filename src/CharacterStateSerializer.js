// @flow

import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';

export default class CharacterStateSerializer {
    sceneDimensions: SceneDimensions;

    constructor(sceneDimensions: SceneDimensions) {
        this.sceneDimensions = sceneDimensions;
    }
    serialize(characterState: CharacterState): string {
        let pathParam = '' +
            this.encodePosition(characterState.xPos) +
            this.encodePosition(characterState.yPos) +
            this.encodeDirection(characterState.direction);
        for ( const pathSegment of characterState.path ) {
            const { x1, x2, y1, y2 } = pathSegment;
            pathParam +=
                this.encodePosition(x1) +
                this.encodePosition(y1) +
                this.encodePosition(x2) +
                this.encodePosition(y2);
        }
        return pathParam;
    }

    deserialize(text: string): CharacterState {
        const xPos = this.decodePosition(text.charAt(0));
        const yPos = this.decodePosition(text.charAt(1));
        const direction = this.decodeDirection(text.charAt(2));
        const path = [];
        // Split path segment part of the text every 4 characters
        const encodedPathSegments = text.substring(3).match(/.{4}/g);
        if (encodedPathSegments != null) {
            for ( const pathSegment of encodedPathSegments ) {
                const x1 = this.decodePosition(pathSegment.charAt(0));
                const y1 = this.decodePosition(pathSegment.charAt(1));
                const x2 = this.decodePosition(pathSegment.charAt(2));
                const y2 = this.decodePosition(pathSegment.charAt(3));
                path.push({ x1, y1, x2, y2 });
            }
        }
        return new CharacterState(xPos, yPos, direction, path, this.sceneDimensions);
    }

    encodeDirection(direction: number): string {
        switch(direction) {
            case(0): return '0';
            case(1): return 'a';
            case(2): return 'b';
            case(3): return 'c';
            case(4): return 'd';
            case(5): return 'e';
            case(6): return 'f';
            case(7): return 'g';
            default: throw new Error(`Unrecognized direction ${direction}`);
        }
    }

    decodeDirection(character: string): number {
        switch(character) {
            case('0'): return 0;
            case('a'): return 1;
            case('b'): return 2;
            case('c'): return 3;
            case('d'): return 4;
            case('e'): return 5;
            case('f'): return 6;
            case('g'): return 7;
            default: throw new Error(`Unrecognized direction character ${character}`);
        }
    }

    encodePosition(positionComponent: number): string {
        // Remove any fractional digits, to make sure we have an integer
        positionComponent = Math.trunc(positionComponent);
        if (positionComponent === 0) {
            return '0';
        } else if (positionComponent > 0 && positionComponent < 27) {
            return String.fromCharCode('a'.charCodeAt(0) - 1 + positionComponent);
        } else if (positionComponent > 26) {
            return 'z';
        } else if (positionComponent < 0 && positionComponent > -27) {
            return String.fromCharCode('A'.charCodeAt(0) - 1 + Math.abs(positionComponent));
        } else if (positionComponent < -26) {
            return 'Z';
        }
        throw new Error(`Position out of the range: ${positionComponent}`);
    }

    decodePosition(character: string): number {
        if (character === '0') {
            return 0;
        }
        const charCode = character.charCodeAt(0);
        if (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) {
            return charCode - 'a'.charCodeAt(0) + 1;
        } else if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
            return (charCode - 'A'.charCodeAt(0) + 1) * -1;
        }
        throw new Error(`Unrecognized position character: '${character}'`);
    }
};
