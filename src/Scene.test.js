// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import Scene from './Scene';
import type {SceneProps} from './Scene';
import SceneDimensions from './SceneDimensions';
import CharacterState from './CharacterState';

configure({ adapter: new Adapter() });

const defaultSceneProps = {
    dimensions: new SceneDimensions(1, 1, 1, 1),
    characterState: new CharacterState(0, 0, 2, [], new SceneDimensions(1, 1, 1, 1)),
    theme: 'mixed',
    world: 'Sketchpad'
};

function createMountScene(props) {
    const wrapper = mount(
        React.createElement(
            Scene,
            (Object.assign(
                {},
                defaultSceneProps,
                props
            ):SceneProps)
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return wrapper;
}

function findScene(sceneWrapper) {
    return sceneWrapper.find('.Scene');
}

function findGridLines(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-line');
}

function findGridLabels(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-label');
}

function findCharacter(sceneWrapper) {
    return sceneWrapper.find('.Character');
}

function findCharacterIcon(sceneWrapper) {
    return sceneWrapper.find('.Character__icon');
}

function findCharacterPath(sceneWrapper) {
    return sceneWrapper.find('.Scene__path-line');
}

function findRowHeader(sceneWrapper) {
    return sceneWrapper.find('.Scene__row-header');
}

function findColumnHeader(sceneWrapper) {
    return sceneWrapper.find('.Scene__column-header');
}

function findSceneBackground(sceneWrapper) {
    return sceneWrapper.find('.Scene__background');
}

// TODO: This function is reproducing logic from Scene (the 0.8) and
//       Character (everything else) and it will be easily
//       broken. Is there a better approach here that tests that the
//       character is rendered as expected, but it less brittle?
function calculateCharacterDimensions() {
    const characterWidth = 0.9;
    const x = -characterWidth/2;
    const y = -characterWidth/2;
    const width = characterWidth;
    const height = characterWidth;
    return { x, y, width, height };
}

describe('When the Scene renders', () => {
    test('With width = 1, height = 1', () => {
        expect.assertions(7);
        const dimensions = new SceneDimensions(1, 1, 1, 1);
        const sceneWrapper = createMountScene({
            dimensions: dimensions
        });

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX() - 0.5} ${dimensions.getMinY() - 0.5} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(2);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(5);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(5);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(0.5);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With width = 3, height = 2', () => {
        expect.assertions(25);
        const dimensions = new SceneDimensions(1, 3, 1, 2);
        const sceneWrapper = createMountScene({
            dimensions: dimensions
        });

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX() - 0.5} ${dimensions.getMinY() - 0.5} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(5);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(5);
        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(15);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(2).props.x).toBe(5);
        expect(findGridLabels(sceneWrapper).get(2).props.y).toBe(0.5);
        expect(findGridLabels(sceneWrapper).get(3).props.x).toBe(15);
        expect(findGridLabels(sceneWrapper).get(3).props.y).toBe(0.5);
        expect(findGridLabels(sceneWrapper).get(4).props.x).toBe(25);
        expect(findGridLabels(sceneWrapper).get(4).props.y).toBe(0.5);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(3);

        // Grid rows

        expect(findGridLines(sceneWrapper).get(0).props.x1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(0).props.y1).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(0).props.x2).toBe(3.5);
        expect(findGridLines(sceneWrapper).get(0).props.y2).toBe(1.5);

        // Grid columns

        expect(findGridLines(sceneWrapper).get(1).props.x1).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(1).props.y1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(1).props.x2).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(1).props.y2).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.x1).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.y1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(2).props.x2).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.y2).toBe(2.5);
    });
});

describe('The ARIA label should tell there is a character with its position', () => {
    test.each([
        [1, 2, 0, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing up'],
        [2, 3, 1, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column B, row 3 facing upper right'],
        [1, 2, 2, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing right'],
        [1, 2, 3, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing lower right'],
        [1, 2, 4, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing down'],
        [1, 2, 5, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing lower left'],
        [1, 2, 6, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing left'],
        [1, 2, 7, 'Scene, in Sketchpad, 17 by 9 grid with the robot at column A, row 2 facing upper left']
    ])('x=%f, y=%f, direction=%i', (x, y, direction, expectedLabel) => {
        const sceneDimensions = new SceneDimensions(1, 17, 1, 9);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(x, y, direction, [], sceneDimensions)
        });
        expect(findScene(sceneWrapper).get(0).props['aria-label']).toBe(expectedLabel);
    });
});

describe('When the Scene renders', () => {
    test('Should render the character component', () => {
        expect.assertions(5);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(1, 1, 1, 1)
        });
        const expectedCharacterDimensions = calculateCharacterDimensions();
        expect(findCharacterIcon(sceneWrapper).hostNodes().length).toBe(1);
        expect(findCharacterIcon(sceneWrapper).get(0).props.x)
            .toBeCloseTo(expectedCharacterDimensions.x, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.y)
            .toBeCloseTo(expectedCharacterDimensions.y, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.width)
            .toBeCloseTo(expectedCharacterDimensions.width, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.height)
            .toBeCloseTo(expectedCharacterDimensions.height, 5);
    });
});

describe('When the character renders, transform should apply', (sceneDimensions = new SceneDimensions(1, 100, 1, 100)) => {
    test('When xPos = 1, yPos = 1, direction = 2', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions)
        });
        const character = findCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(1 1) rotate(0 0 0)');
    });
    test('When xPos = 10, yPos = 8, direction = 4', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(10, 8, 4, [], sceneDimensions)
        });
        const character = findCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(10 8) rotate(90 0 0) scale(1 -1)');
    });
    test('When the character is rotated, rotation and/or mirroring should be applied', () => {
        expect.assertions(9);

        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions)
        });

        const character = findCharacter(sceneWrapper);

        expect(character.get(0).props.transform).toBe('translate(1 1) rotate(0 0 0)');

        // Hard-coded to avoid having to test math with math.
        const expectedValues = [
            "translate(1 1) rotate(-90 0 0)",
            "translate(1 1) rotate(-45 0 0)",
            "translate(1 1) rotate(0 0 0)",
            "translate(1 1) rotate(45 0 0)",
            "translate(1 1) rotate(90 0 0) scale(1 -1)",
            "translate(1 1) rotate(135 0 0) scale(1 -1)",
            "translate(1 1) rotate(180 0 0) scale(1 -1)",
            "translate(1 1) rotate(225 0 0) scale(1 -1)"
        ];

        for (let direction = 0; direction <= 7; direction++) {
            sceneWrapper.setProps({characterState: new CharacterState(1, 1, direction, [], new SceneDimensions(1, 100, 1, 100))});
            const rotatedCharacter = findCharacter(sceneWrapper);
            expect(rotatedCharacter.get(0).props.transform).toBe(expectedValues[direction]);
        }
    });
});

describe('When the Character has a path, it is drawn on the Scene', () => {
    test('When there is no path segment', () => {
        expect.assertions(1);
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
        const sceneWrapper = createMountScene({
            characterState: new CharacterState(0, 0, 2, [], sceneDimensions)
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(0);
    });

    test('When there is one path segment', () => {
        expect.assertions(5);
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000)
        const sceneWrapper = createMountScene({
            characterState: new CharacterState(0, 0, 2, [{x1: 100, y1: 200, x2: 300, y2: 400}], sceneDimensions)
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(1);
        expect(characterPath.get(0).props.x1).toBe(100);
        expect(characterPath.get(0).props.y1).toBe(200);
        expect(characterPath.get(0).props.x2).toBe(300);
        expect(characterPath.get(0).props.y2).toBe(400);
    });

    test('When there are two path segments', () => {
        expect.assertions(9);
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
        const sceneWrapper = createMountScene({
            characterState:
                new CharacterState(0, 0, 2, [
                    {x1: 100, y1: 200, x2: 300, y2: 400},
                    {x1: 500, y1: 600, x2: 700, y2: 800}
                ], sceneDimensions)
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(2);
        expect(characterPath.get(0).props.x1).toBe(100);
        expect(characterPath.get(0).props.y1).toBe(200);
        expect(characterPath.get(0).props.x2).toBe(300);
        expect(characterPath.get(0).props.y2).toBe(400);
        expect(characterPath.get(1).props.x1).toBe(500);
        expect(characterPath.get(1).props.y1).toBe(600);
        expect(characterPath.get(1).props.x2).toBe(700);
        expect(characterPath.get(1).props.y2).toBe(800);
    })
})

describe('When Scene gets scrolled', () => {
    test('Row header gets scrolled by same amount of scrollTop', () => {
        expect.assertions(2);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const rowHeader = findRowHeader(sceneWrapper);
        rowHeader.ref.currentTarget = {
            scrollTop: 0
        };
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(0);
        scene.ref.currentTarget = {
            scrollTop: 200
        };
        scene.simulate('scroll');
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(200);
    });

    test('Column header gets scrolled by same amount of scrollLeft', () => {
        expect.assertions(2);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const columnHeader = findColumnHeader(sceneWrapper);
        columnHeader.ref.currentTarget = {
            scrollLeft: 0
        };
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(0);
        scene.ref.currentTarget = {
            scrollLeft: 200
        };
        scene.simulate('scroll');
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(200);
    });

    test('Both row header and column header can be updated together', () => {
        expect.assertions(4);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const rowHeader = findRowHeader(sceneWrapper);
        const columnHeader = findColumnHeader(sceneWrapper);
        rowHeader.ref.currentTarget = {
            scrollTop: 0
        };
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(0);
        columnHeader.ref.currentTarget = {
            scrollLeft: 0
        };
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(0);
        scene.ref.currentTarget = {
            scrollTop: 200,
            scrollLeft: 200
        };
        scene.simulate('scroll');
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(200);
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(200);
    });
});

describe('Scene background changes when world and theme change', () => {
    test('world property changes to Sketchpad(default)', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene();
        const sceneBackground = findSceneBackground(sceneWrapper);
        // Renders no background
        expect(sceneBackground.get(0)).toBe(undefined);
        sceneWrapper.setProps({theme: 'gray'});
        expect(sceneBackground.get(0)).toBe(undefined);
        sceneWrapper.setProps({theme: 'contrast'});
        expect(sceneBackground.get(0)).toBe(undefined);
    });
    test('world property changes to Space', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'Space'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space-contrast.svg');
    });
    test('world property changes to Jungle', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'Jungle'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Jungle.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Jungle-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Jungle-contrast.svg');
    });
    test('world property changes to DeepOcean', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'DeepOcean'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean-contrast.svg');
    });
});
