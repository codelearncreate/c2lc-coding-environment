// @flow

import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import { encodeCoordinate, encodeDirection, decodeCoordinate, decodeDirection } from './Utils';

export default class CharacterStateSerializer {
    sceneDimensions: SceneDimensions;

    constructor(sceneDimensions: SceneDimensions) {
        this.sceneDimensions = sceneDimensions;
    }
    serialize(characterState: CharacterState): string {
        let pathParam = '' +
            encodeCoordinate(characterState.xPos) +
            encodeCoordinate(characterState.yPos) +
            encodeDirection(characterState.direction);
        for ( const pathSegment of characterState.path ) {
            const { x1, x2, y1, y2 } = pathSegment;
            pathParam +=
                encodeCoordinate(x1) +
                encodeCoordinate(y1) +
                encodeCoordinate(x2) +
                encodeCoordinate(y2);
        }
        return pathParam;
    }

    deserialize(text: string): CharacterState {
        const xPos = decodeCoordinate(text.charAt(0));
        const yPos = decodeCoordinate(text.charAt(1));
        const direction = decodeDirection(text.charAt(2));
        const path = [];
        // Split path segment part of the text every 4 characters
        const encodedPathSegments = text.substring(3).match(/.{4}/g);
        if (encodedPathSegments != null) {
            for ( const pathSegment of encodedPathSegments ) {
                const x1 = decodeCoordinate(pathSegment.charAt(0));
                const y1 = decodeCoordinate(pathSegment.charAt(1));
                const x2 = decodeCoordinate(pathSegment.charAt(2));
                const y2 = decodeCoordinate(pathSegment.charAt(3));
                path.push({ x1, y1, x2, y2 });
            }
        }
        return new CharacterState(xPos, yPos, direction, path, this.sceneDimensions);
    }
};
