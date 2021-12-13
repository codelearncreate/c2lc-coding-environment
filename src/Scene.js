// @flow

import React from 'react';
import CharacterState from './CharacterState';
import Character from './Character';
import SceneDimensions from './SceneDimensions';
import { getBackgroundInfo, getWorldProperties } from './Worlds';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import './Scene.scss';
import './Worlds.scss';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';

export type SceneProps = {
    dimensions: SceneDimensions,
    characterState: CharacterState,
    theme: ThemeName,
    world: WorldName,
    intl: IntlShape
};

class Scene extends React.Component<SceneProps, {}> {
    characterBackgroundRef: { current: null | Element };
    sceneRef: { current: null | HTMLDivElement };

    constructor (props: SceneProps) {
        super(props);
        this.characterBackgroundRef = React.createRef();
        this.sceneRef = React.createRef();
    }

    drawGrid(): any {
        const grid = [];
        const rowLabels = [];
        const columnLabels = [];
        let yOffset = this.props.dimensions.getMinY() - 0.5;
        for (let i=1; i < this.props.dimensions.getHeight() + 1; i++) {
            yOffset += 1;
            if (i < this.props.dimensions.getHeight()) {
                grid.push(<line
                    className={`Scene__grid-line Scene__grid-line--${this.props.world}`}
                    key={`grid-cell-row-${i}`}
                    x1={this.props.dimensions.getMinX() - 0.5}
                    y1={yOffset}
                    x2={this.props.dimensions.getMaxX() + 0.5}
                    y2={yOffset} />);
            }
            rowLabels.push(
                <text
                    className='Scene__grid-label'
                    aria-hidden='true'
                    textAnchor='middle'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={-0.5}
                    // Center the label with cell height of 10
                    y={i*10 - 5}>
                    {i}
                </text>
            )
        }
        let xOffset = this.props.dimensions.getMinX() - 0.5;
        for (let i=1; i < this.props.dimensions.getWidth() + 1; i++) {
            xOffset += 1;
            if (i < this.props.dimensions.getWidth()) {
                grid.push(<line
                    className={`Scene__grid-line Scene__grid-line--${this.props.world}`}
                    key={`grid-cell-column-${i}`}
                    x1={xOffset}
                    y1={this.props.dimensions.getMinY() - 0.5}
                    x2={xOffset}
                    y2={this.props.dimensions.getMaxY() + 0.5} />);
            }
            columnLabels.push(
                <text
                    className='Scene__grid-label'
                    aria-hidden='true'
                    key={`grid-cell-label-${String.fromCharCode(64+i)}`}
                    textAnchor='middle'
                    // Center the label with cell width of 10
                    x={i*10 - 5}
                    y={0.5}>
                    {String.fromCharCode(64+i)}
                </text>
            )
        }
        return { grid, rowLabels, columnLabels };
    }

    drawCharacterPath() {
        return this.props.characterState.path.map((pathSegment, i) => {
            return <line
                className={`Scene__path-line Scene__path-line--${this.props.world}`}
                key={`path-${i}`}
                x1={pathSegment.x1}
                y1={pathSegment.y1}
                x2={pathSegment.x2}
                y2={pathSegment.y2} />
        });
    }

    getDirectionWords(direction: number): string {
        return this.props.intl.formatMessage({id: `Direction.${direction}`});
    }

    getRelativeDirection(xPos: number, yPos: number): string {
        if (this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'inBounds') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.0'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.1'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'inBounds' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.2'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.3'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'inBounds') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.4'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.5'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'inBounds' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.6'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.7'});
        } else {
            throw new Error(`Unrecognized xPos: ${xPos} or yPos: ${yPos}`);
        }
    }

    getBackground(x: number, y: number, width: number, height: number) {
        const worldProperties = getWorldProperties(this.props.world);
        if (this.props.theme === 'gray') {
            if (worldProperties.backgroundGray) {
                return React.createElement(worldProperties.backgroundGray, {
                    className: 'Scene__background',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        } else if (this.props.theme === 'contrast') {
            if (worldProperties.backgroundContrast) {
                return React.createElement(worldProperties.backgroundContrast, {
                    className: 'Scene__background',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        } else {
            if (worldProperties.background) {
                return React.createElement(worldProperties.background, {
                    className: 'Scene__background',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        }
    }

    generateAriaLabel() {
        const { xPos, yPos } = this.props.characterState;
        const characterState = this.props.characterState;
        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();
        const numColumns = this.props.dimensions.getWidth();
        const numRows = this.props.dimensions.getHeight();
        const direction = this.getDirectionWords(characterState.direction);

        const characterLabel = this.props.intl.formatMessage({id: this.props.world + '.character'});
        const worldLabel = this.props.intl.formatMessage({id: this.props.world + '.name'});

        if (this.props.dimensions.getBoundsStateX(xPos) !== 'inBounds'
            || this.props.dimensions.getBoundsStateY(yPos) !== 'inBounds') {
            return this.props.intl.formatMessage(
                { id: 'Scene.outOfBounds' },
                {
                    numColumns,
                    numRows,
                    direction,
                    relativeDirection: this.getRelativeDirection(xPos, yPos),
                    world: worldLabel,
                    character: characterLabel
                }
            )
        } else {
            const backgroundInfo = getBackgroundInfo(this.props.world, columnLabel, rowLabel);
            if (backgroundInfo) {
                const itemOnGridCell = this.props.intl.formatMessage({ id: `${this.props.world}.${backgroundInfo}` });
                return this.props.intl.formatMessage(
                    { id: 'Scene.inBoundsOnItem' },
                    {
                        numColumns: this.props.dimensions.getWidth(),
                        numRows: this.props.dimensions.getHeight(),
                        xPos: columnLabel,
                        yPos: rowLabel,
                        direction,
                        item: itemOnGridCell,
                        world: worldLabel,
                        character: characterLabel
                    }
                )
            }
            return this.props.intl.formatMessage(
                { id: 'Scene.inBounds' },
                {
                    numColumns: this.props.dimensions.getWidth(),
                    numRows: this.props.dimensions.getHeight(),
                    xPos: columnLabel,
                    yPos: rowLabel,
                    direction,
                    world: worldLabel,
                    character: characterLabel
                }
            )
        }
    }

    handleScrollScene = (e: SyntheticEvent<HTMLDivElement>) => {
        const sceneScrollTop = e.currentTarget.scrollTop;
        const sceneScrollLeft = e.currentTarget.scrollLeft;
        const rowHeader = document.getElementById('scene-row-header');
        const columnHeader = document.getElementById('scene-column-header');
        if ((sceneScrollTop != null || sceneScrollLeft != null) && rowHeader && columnHeader) {
            rowHeader.scrollTop = sceneScrollTop;
            columnHeader.scrollLeft = sceneScrollLeft;
        }
    }

    componentDidUpdate = (prevProps) => {
        // Required to avoid the lack of scrollIntoView on SVG elements in Safari.
        /* istanbul ignore next */
        if ((prevProps.characterState.xPos !== this.props.characterState.xPos ||
            prevProps.characterState.yPos !== this.props.characterState.yPos) &&
            this.sceneRef.current !== null && this.characterBackgroundRef.current !== null) {
            const newCharacterBackgroundBounds = this.characterBackgroundRef.current.getBoundingClientRect();
            if (newCharacterBackgroundBounds) {
                // $FlowFixMe: Flow doesn't understand that the scene has this method.
                const sceneBounds = this.sceneRef.current.getBoundingClientRect();

                // Check to see if the character is visible. If not, scroll to bring it into view. We do this ourselves
                // for two reasons:
                //
                // 1. On Safari, scrollIntoView doesn't work on SVG elements (C2LC-347).
                // 2. On Firefox, scrollIntoView seems to scroll to the center of the character rather than bringing it
                //    completely into view (C2LC-343).
                //
                // We add some padding to the position checking (0.5 times the
                // width or height) to ensure that we always leave some room
                // between the character and the edge of the scene (unless we
                // are in the first or last row/col).
                if (newCharacterBackgroundBounds.left - (0.5 * newCharacterBackgroundBounds.width) < sceneBounds.left) {
                    // Scroll left.
                    // $FlowFixMe: Flow doesn't understand that this element has a scrollLeft.
                    this.sceneRef.current.scrollLeft -= (sceneBounds.left - newCharacterBackgroundBounds.left + newCharacterBackgroundBounds.width);
                }
                else if ((newCharacterBackgroundBounds.left + (1.5 * newCharacterBackgroundBounds.width)) > (sceneBounds.left + sceneBounds.width)) {
                    // Scroll right.
                    // $FlowFixMe: Flow doesn't understand that this element has a scrollLeft.
                    this.sceneRef.current.scrollLeft += (newCharacterBackgroundBounds.left + newCharacterBackgroundBounds.width) - (sceneBounds.left + sceneBounds.width) + newCharacterBackgroundBounds.width;
                }

                if (newCharacterBackgroundBounds.top - (0.5 * newCharacterBackgroundBounds.height) < sceneBounds.top) {
                    // Scroll up.  For whatever reason we have to overshoot on the scroll to avoid leaving the icon half out of bounds and constantly triggering scrolls.
                    // $FlowFixMe: Flow doesn't understand that this element has a scrollTop.
                    this.sceneRef.current.scrollTop -= (sceneBounds.top - newCharacterBackgroundBounds.top + newCharacterBackgroundBounds.height);
                }
                else if ((newCharacterBackgroundBounds.top + (1.5 * newCharacterBackgroundBounds.height)) > (sceneBounds.top + sceneBounds.height)) {
                    // Scroll down.
                    // $FlowFixMe: Flow doesn't understand that this element has a scrollTop.
                    this.sceneRef.current.scrollTop += (newCharacterBackgroundBounds.top + newCharacterBackgroundBounds.height) - (sceneBounds.top + sceneBounds.height) + newCharacterBackgroundBounds.height;
                }
            }
        }
    }

    render() {
        const minX = this.props.dimensions.getMinX() - 0.5;
        const minY = this.props.dimensions.getMinY() - 0.5;
        const width = this.props.dimensions.getWidth();
        const height = this.props.dimensions.getHeight();
        const grid = this.drawGrid().grid;
        const rowLabels = this.drawGrid().rowLabels;
        const columnLabels = this.drawGrid().columnLabels;

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        let characterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.getDirectionDegrees() - 90} 0 0)`;
        if (this.props.characterState.direction > 3) {
            characterTransform += ` scale(1 -1)`
        }

        // For the background, use the same translation, but skip the rotation and mirroring.
        const characterBackgroundTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos})`;

        return (
            <React.Fragment>
                <div className='Scene__container'>
                    <div
                        tabIndex='-1'
                        aria-hidden='true'
                        id='scene-row-header'
                        className='Scene__row-header'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox={`-2 0 3 ${height * 10}`}>
                            {rowLabels}
                        </svg>
                    </div>
                    <div
                        tabIndex='-1'
                        aria-hidden='true'
                        id='scene-column-header'
                        className='Scene__column-header'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox={`0 -2 ${width * 10} 3`}>
                            {columnLabels}
                        </svg>
                    </div>
                    <div
                        id='scene'
                        className='Scene'
                        role='img'
                        aria-label={this.generateAriaLabel()}
                        onScroll={this.handleScrollScene}
                        ref={this.sceneRef}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox={`${minX} ${minY} ${width} ${height}`}>
                            <defs>
                                <clipPath id='Scene-clippath'>
                                    <rect x={minX} y={minY} width={width} height={height} />
                                </clipPath>
                            </defs>
                            {this.getBackground(minX, minY, width, height)}
                            {grid}
                            <g clipPath='url(#Scene-clippath)'>
                                {this.drawCharacterPath()}
                                <rect
                                    className={`Character-background--${this.props.world}`}
                                    x={-0.5}
                                    y={-0.5}
                                    height={1}
                                    width={1}
                                    ref={this.characterBackgroundRef}
                                    transform={characterBackgroundTransform}
                                />
                                <Character
                                    world={this.props.world}
                                    theme={this.props.theme}
                                    transform={characterTransform}
                                    width={0.9}
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(Scene);
