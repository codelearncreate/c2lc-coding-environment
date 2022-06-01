// @flow

import * as React from 'react';
import type { ThemeName } from './types';

// Camping
import { ReactComponent as Camping } from './svg/Camping.svg';
import { ReactComponent as CampingGray } from './svg/Camping-gray.svg';
import { ReactComponent as CampingContrast } from './svg/Camping-contrast.svg';
import { ReactComponent as CampingThumbnail } from './svg/CampingThumbnail.svg';
import { ReactComponent as CampingThumbnailGray } from './svg/CampingThumbnail-gray.svg';
import { ReactComponent as CampingThumbnailContrast } from './svg/CampingThumbnail-contrast.svg';
import { ReactComponent as Squirrel } from './svg/Squirrel.svg';
import { ReactComponent as SquirrelGray } from './svg/Squirrel-gray.svg';
import { ReactComponent as SquirrelContrast } from './svg/Squirrel-contrast.svg';

// DeepOcean
import { ReactComponent as DeepOcean } from './svg/DeepOcean.svg';
import { ReactComponent as DeepOceanGray } from './svg/DeepOcean-gray.svg';
import { ReactComponent as DeepOceanContrast } from './svg/DeepOcean-contrast.svg';
import { ReactComponent as DeepOceanThumbnail } from './svg/DeepOceanThumbnail.svg';
import { ReactComponent as DeepOceanThumbnailGray } from './svg/DeepOceanThumbnail-gray.svg';
import { ReactComponent as DeepOceanThumbnailContrast } from './svg/DeepOceanThumbnail-contrast.svg';
import { ReactComponent as Submarine } from './svg/Submarine.svg';
import { ReactComponent as SubmarineGray } from './svg/Submarine-gray.svg';
import { ReactComponent as SubmarineContrast } from './svg/Submarine-contrast.svg';

// Jungle
import { ReactComponent as Jungle } from './svg/Jungle.svg';
import { ReactComponent as JungleGray } from './svg/Jungle-gray.svg';
import { ReactComponent as JungleContrast } from './svg/Jungle-contrast.svg';
import { ReactComponent as JungleThumbnail } from './svg/JungleThumbnail.svg';
import { ReactComponent as JungleThumbnailGray } from './svg/JungleThumbnail-gray.svg';
import { ReactComponent as JungleThumbnailContrast } from './svg/JungleThumbnail-contrast.svg';
import { ReactComponent as SafariJeep } from './svg/SafariJeep.svg';
import { ReactComponent as SafariJeepGray } from './svg/SafariJeep-gray.svg';
import { ReactComponent as SafariJeepContrast } from './svg/SafariJeep-contrast.svg';

// Landmarks
import { ReactComponent as LandmarksWorld } from './svg/LandmarksWorld.svg';
import { ReactComponent as LandmarksWorldGray } from './svg/LandmarksWorldGray.svg';
import { ReactComponent as LandmarksWorldContrast } from './svg/LandmarksWorldContrast.svg';
import { ReactComponent as LandmarksThumbnail } from './svg/LandmarksThumbnail.svg';
import { ReactComponent as LandmarksThumbnailGray } from './svg/LandmarksThumbnailGray.svg';
import { ReactComponent as LandmarksThumbnailContrast } from './svg/LandmarksThumbnailContrast.svg';
import { ReactComponent as Bot } from './svg/Bot.svg';
import { ReactComponent as BotGray } from './svg/BotGray.svg';
import { ReactComponent as BotContrast } from './svg/BotContrast.svg';

// Sketchpad
import { ReactComponent as SketchpadThumbnail } from './svg/SketchpadThumbnail.svg';
import { ReactComponent as SketchpadThumbnailDark } from './svg/SketchpadThumbnail-dark.svg';
import { ReactComponent as SketchpadThumbnailGray } from './svg/SketchpadThumbnail-gray.svg';
import { ReactComponent as SketchpadThumbnailContrast } from './svg/SketchpadThumbnail-contrast.svg';
import { ReactComponent as Robot } from './svg/Robot.svg';
import { ReactComponent as RobotGray } from './svg/RobotGray.svg';
import { ReactComponent as RobotContrast } from './svg/RobotContrast.svg';

// Space
import { ReactComponent as Space } from './svg/Space.svg';
import { ReactComponent as SpaceGray } from './svg/Space-gray.svg';
import { ReactComponent as SpaceContrast } from './svg/Space-contrast.svg';
import { ReactComponent as SpaceThumbnail } from './svg/SpaceThumbnail.svg';
import { ReactComponent as SpaceThumbnailGray } from './svg/SpaceThumbnail-gray.svg';
import { ReactComponent as SpaceThumbnailContrast } from './svg/SpaceThumbnail-contrast.svg';
import { ReactComponent as SpaceShip } from './svg/SpaceShip.svg';
import { ReactComponent as SpaceShipGray } from './svg/SpaceShip-gray.svg';
import { ReactComponent as SpaceShipContrast } from './svg/SpaceShip-contrast.svg';

export type WorldProperties = {|
    background: ?React.ComponentType<{}>,
    backgroundGray: ?React.ComponentType<{}>,
    backgroundContrast: ?React.ComponentType<{}>,
    backgroundInfo: ?{ [string]: string },
    thumbnail: React.ComponentType<{}>,
    thumbnailDark: React.ComponentType<{}>,
    thumbnailGray: React.ComponentType<{}>,
    thumbnailContrast: React.ComponentType<{}>,
    character: React.ComponentType<{}>,
    characterGray: React.ComponentType<{}>,
    characterContrast: React.ComponentType<{}>,
    startingX: number,
    startingY: number,
    startingDirection: number,
    enableFlipCharacter: boolean
|};

const worlds: {|
    'Camping': WorldProperties,
    'DeepOcean': WorldProperties,
    'Jungle': WorldProperties,
    'Landmarks': WorldProperties,
    'Sketchpad': WorldProperties,
    'Space': WorldProperties
|} = {
    'Camping': {
        background: Camping,
        backgroundGray: CampingGray,
        backgroundContrast: CampingContrast,
        backgroundInfo: {
            A1: 'trunk',
            B1: 'trunk',
            A2: 'trunk',
            B2: 'trunk',
            C2: 'branch',
            D2: 'branch',
            E2: 'branch',
            F2: 'branch',
            G2: 'branch',
            H2: 'branch',
            I2: 'ladder',
            J2: 'branch',
            A3: 'trunk',
            B3: 'trunk',
            I3: 'ladder',
            A4: 'trunk',
            B4: 'trunk',
            C4: 'bear',
            D4: 'bear',
            E4: 'lake',
            F4: 'lake',
            G4: 'lake',
            H4: 'lake',
            I4: 'ladder',
            J4: 'lake',
            A5: 'trunk',
            B5: 'bear',
            C5: 'bear',
            D5: 'bear',
            F5: 'fire',
            G5: 'fire',
            H5: 'fire',
            I5: 'ladder',
            K5: 'tentdoor',
            A6: 'trunk',
            B6: 'bear',
            C6: 'bear',
            D6: 'bear',
            E6: 'bear',
            F6: 'fire',
            G6: 'fire',
            H6: 'fire',
            I6: 'ladder',
            K6: 'tentdoor',
            A7: 'trunk',
            B7: 'trunk',
            C7: 'bear',
            D7: 'bear',
            E7: 'bear',
            F7: 'fire',
            G7: 'fire',
            H7: 'fire',
            I7: 'ladder',
            K7: 'tentdoor',
            L7: 'tentdoor',
            A8: 'trunk',
            B8: 'trunk',
            D8: 'bear',
            E8: 'bear',
            K8: 'tentdoor',
            L8: 'tentdoor'
        },
        thumbnail: CampingThumbnail,
        thumbnailDark: CampingThumbnail,
        thumbnailGray: CampingThumbnailGray,
        thumbnailContrast: CampingThumbnailContrast,
        character: Squirrel,
        characterGray: SquirrelGray,
        characterContrast: SquirrelContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'DeepOcean': {
        background: DeepOcean,
        backgroundGray: DeepOceanGray,
        backgroundContrast: DeepOceanContrast,
        backgroundInfo: {
            J2: 'fishGroup',
            K2: 'fishGroup',
            J3: 'fishGroup',
            K3: 'fishGroup',
            B4: 'babyJellyfish',
            C4: 'jellyfish',
            G4: 'shark',
            H4: 'shark',
            K4: 'shark',
            L4: 'coral',
            B5: 'babyJellyfish',
            C5: 'jellyfish',
            E5: 'shark',
            F5: 'shark',
            G5: 'shark',
            H5: 'shark',
            I5: 'shark',
            J5: 'shark',
            K5: 'shark',
            L5: 'coral',
            F6: 'shark',
            G6: 'shark',
            H6: 'shark',
            I6: 'shark',
            A7: 'fish',
            B7: 'coral',
            G7: 'treasure',
            H7: 'treasure',
            I7: 'treasure',
            A8: 'coral',
            B8: 'fish',
            G8: 'treasure',
            H8: 'treasure',
            I8: 'treasure'
        },
        thumbnail: DeepOceanThumbnail,
        thumbnailDark: DeepOceanThumbnail,
        thumbnailGray: DeepOceanThumbnailGray,
        thumbnailContrast: DeepOceanThumbnailContrast,
        character: Submarine,
        characterGray: SubmarineGray,
        characterContrast: SubmarineContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Jungle': {
        background: Jungle,
        backgroundGray: JungleGray,
        backgroundContrast: JungleContrast,
        backgroundInfo: {
            G1: 'giraffe',
            J1: 'lion',
            F2: 'giraffe',
            G2: 'babyGiraffe',
            A4: 'tree',
            B4: 'tree',
            C4: 'tree',
            E4: 'bush',
            F4: 'bush',
            K4: 'tree',
            L4: 'tree',
            A5: 'tree',
            B5: 'tree',
            H5: 'flamingo',
            E6: 'babyAlligator',
            F6: 'babyAlligator',
            G6: 'pond',
            H6: 'flamingo',
            I6: 'pond',
            J6: 'hippo',
            K6: 'hippo',
            C7: 'alligator',
            D7: 'alligator',
            E7: 'alligator',
            F7: 'alligator',
            G7: 'pond',
            H7: 'pond',
            I7: 'pond',
            J7: 'pond',
            A8: 'bush',
            B8: 'bush',
            L8: 'bush'
        },
        thumbnail: JungleThumbnail,
        thumbnailDark: JungleThumbnail,
        thumbnailGray: JungleThumbnailGray,
        thumbnailContrast: JungleThumbnailContrast,
        character: SafariJeep,
        characterGray: SafariJeepGray,
        characterContrast: SafariJeepContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Landmarks': {
        background: LandmarksWorld,
        backgroundGray: LandmarksWorldGray,
        backgroundContrast: LandmarksWorldContrast,
        backgroundInfo : {
            A1: 'plane',
            A4: 'easterIsland',
            A6: 'leaningTowerPisa',
            B3: 'greatSphinx',
            B8: 'stonehenge',
            C2: 'greatPyramid',
            C7: 'eiffelTower',
            D5: 'fairyChimneys',
            E2: 'colosseum',
            E7: 'tajMahal',
            F4: 'burAlArab',
            F8: 'statueLiberty',
            G1: 'floatingMarket',
            G6: 'greatWall',
            H3: 'windmill',
            H5: 'cnTower',
            I2: 'tableMountain',
            I8: 'tokyoTower',
            J4: 'niagaraFalls',
            J6: 'grandCanyon',
            K3: 'bigBen',
            K7: 'operaHouse',
            L1: 'machuPicchu',
            L5: 'stBasils',
            L8: 'train'
        },
        thumbnail: LandmarksThumbnail,
        thumbnailDark: LandmarksThumbnail,
        thumbnailGray: LandmarksThumbnailGray,
        thumbnailContrast: LandmarksThumbnailContrast,
        character: Bot,
        characterGray: BotGray,
        characterContrast: BotContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: false
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        backgroundInfo: null,
        thumbnail: SketchpadThumbnail,
        thumbnailDark: SketchpadThumbnailDark,
        thumbnailGray: SketchpadThumbnailGray,
        thumbnailContrast: SketchpadThumbnailContrast,
        character: Robot,
        characterGray: RobotGray,
        characterContrast: RobotContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast,
        backgroundInfo: {
            A1: 'earth',
            C1: 'moon',
            F1: 'meteor',
            L1: 'aliens',
            A2: 'earth',
            B2: 'earth',
            H2: 'saturn',
            I2: 'saturn',
            J2: 'saturn',
            A3: 'earth',
            F3: 'asteroid',
            G3: 'asteroid',
            I3: 'saturn',
            J3: 'saturn',
            L3: 'star',
            B4: 'meteor',
            I5: 'asteroid',
            J5: 'asteroid',
            D6: 'mars',
            G6: 'meteor',
            A7: 'asteroid',
            B7: 'asteroid',
            I7: 'satellite',
            E8: 'star'
        },
        thumbnail: SpaceThumbnail,
        thumbnailDark: SpaceThumbnail,
        thumbnailGray: SpaceThumbnailGray,
        thumbnailContrast: SpaceThumbnailContrast,
        character: SpaceShip,
        characterGray: SpaceShipGray,
        characterContrast: SpaceShipContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    }
};

export type WorldName = $Keys<typeof worlds>;

export function isWorldName(str: ?string): boolean {
    return worlds.hasOwnProperty(str);
}

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}

export function getBackgroundInfo(world: WorldName, columnLabel: string, rowLabel: string): ?string {
    const worldBackgroundInfo = worlds[world].backgroundInfo;
    if (worldBackgroundInfo) {
        const cellKey = columnLabel + rowLabel;
        if (worldBackgroundInfo.hasOwnProperty(cellKey)) {
            return worldBackgroundInfo[cellKey];
        } else {
            return null;
        }
    }
    return null;
}

export function getWorldCharacter(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.characterGray;
    } else if (theme === 'contrast') {
        return worldProperties.characterContrast;
    } else {
        return worldProperties.character;
    }
}

export function getWorldThumbnail(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.thumbnailGray;
    } else if (theme === 'contrast') {
        return worldProperties.thumbnailContrast;
    } else if (theme === 'dark') {
        return worldProperties.thumbnailDark;
    } else {
        return worldProperties.thumbnail;
    }
}
