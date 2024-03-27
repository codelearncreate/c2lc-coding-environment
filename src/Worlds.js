// @flow

import * as React from 'react';
import type { ThemeName } from './types';

// Amusement Park
import { ReactComponent as AmusementPark } from './svg/AmusementPark.svg';
import { ReactComponent as AmusementParkGray } from './svg/AmusementParkGray.svg';
import { ReactComponent as AmusementParkContrast } from './svg/AmusementParkContrast.svg';
import { ReactComponent as AmusementParkThumbnail } from './svg/AmusementParkThumbnail.svg';
import { ReactComponent as AmusementParkThumbnailGray } from './svg/AmusementParkThumbnailGray.svg';
import { ReactComponent as AmusementParkThumbnailContrast } from './svg/AmusementParkThumbnailContrast.svg';
import { ReactComponent as AmusementParkTrain } from './svg/AmusementParkTrain.svg';

// Atlantic Canada
import { ReactComponent as AtlanticCanada } from './svg/AtlanticCanada.svg';
import { ReactComponent as AtlanticCanadaGray } from './svg/AtlanticCanadaGray.svg';
import { ReactComponent as AtlanticCanadaContrast } from './svg/AtlanticCanadaContrast.svg';
import { ReactComponent as AtlanticCanadaThumbnail } from './svg/AtlanticCanadaThumbnail.svg';
import { ReactComponent as AtlanticCanadaThumbnailGray } from './svg/AtlanticCanadaThumbnailGray.svg';
import { ReactComponent as AtlanticCanadaThumbnailContrast } from './svg/AtlanticCanadaThumbnailContrast.svg';
import { ReactComponent as AtlanticCanadaCapeIslander } from './svg/AtlanticCanadaCapeIslander.svg';
import { ReactComponent as AtlanticCanadaCapeIslanderGray } from './svg/AtlanticCanadaCapeIslanderGray.svg';
import { ReactComponent as AtlanticCanadaCapeIslanderContrast } from './svg/AtlanticCanadaCapeIslanderContrast.svg';

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

// Europe Trip
import { ReactComponent as EuropeTrip } from './svg/EuropeTrip.svg';
import { ReactComponent as EuropeTripGray } from './svg/EuropeTripGray.svg';
import { ReactComponent as EuropeTripContrast } from './svg/EuropeTripContrast.svg';
import { ReactComponent as EuropeTripThumbnail } from './svg/EuropeTripThumbnail.svg';
import { ReactComponent as EuropeTripThumbnailGray } from './svg/EuropeTripThumbnailGray.svg';
import { ReactComponent as EuropeTripThumbnailContrast } from './svg/EuropeTripThumbnailContrast.svg';
import { ReactComponent as EuropeTripPlane } from './svg/EuropeTripPlane.svg';
import { ReactComponent as EuropeTripPlaneGray } from './svg/EuropeTripPlaneGray.svg';
import { ReactComponent as EuropeTripPlaneContrast } from './svg/EuropeTripPlaneContrast.svg';

// Grocery Store
import { ReactComponent as GroceryStore } from './svg/GroceryStore.svg';
import { ReactComponent as GroceryStoreGray } from './svg/GroceryStoreGray.svg';
import { ReactComponent as GroceryStoreContrast } from './svg/GroceryStoreContrast.svg';
import { ReactComponent as GroceryStoreThumbnail } from './svg/GroceryStoreThumbnail.svg';
import { ReactComponent as GroceryStoreThumbnailGray } from './svg/GroceryStoreThumbnailGray.svg';
import { ReactComponent as GroceryStoreThumbnailContrast } from './svg/GroceryStoreThumbnailContrast.svg';
import { ReactComponent as GroceryStoreCart } from './svg/GroceryStoreCart.svg';
import { ReactComponent as GroceryStoreCartGray } from './svg/GroceryStoreCartGray.svg';
import { ReactComponent as GroceryStoreCartContrast } from './svg/GroceryStoreCartContrast.svg';

// Haunted House
import { ReactComponent as Haunted } from './svg/Haunted.svg';
import { ReactComponent as HauntedGray } from './svg/Haunted-gray.svg';
import { ReactComponent as HauntedContrast } from './svg/Haunted-contrast.svg';
import { ReactComponent as HauntedThumbnail } from './svg/HauntedThumbnail.svg';
import { ReactComponent as HauntedThumbnailGray } from './svg/HauntedThumbnail-gray.svg';
import { ReactComponent as HauntedThumbnailContrast } from './svg/HauntedThumbnail-contrast.svg';
import { ReactComponent as HauntedFlashlight } from './svg/HauntedFlashlight.svg';

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

// Marble
import { ReactComponent as MarbleWorld } from './svg/MarbleWorld.svg';
import { ReactComponent as MarbleWorldGray } from './svg/MarbleWorldGray.svg';
import { ReactComponent as MarbleWorldContrast } from './svg/MarbleWorldContrast.svg';
import { ReactComponent as MarbleThumbnail } from './svg/MarbleThumbnail.svg';
import { ReactComponent as MarbleThumbnailGray } from './svg/MarbleThumbnailGray.svg';
import { ReactComponent as MarbleThumbnailContrast } from './svg/MarbleThumbnailContrast.svg';
import { ReactComponent as Marble } from './svg/Marble.svg';

// Music Band

import { ReactComponent as MusicBand } from './svg/MusicBand.svg';
import { ReactComponent as MusicBandGray } from './svg/MusicBandGray.svg';
import { ReactComponent as MusicBandContrast } from './svg/MusicBandContrast.svg';
import { ReactComponent as MusicBandThumbnail } from './svg/MusicBandThumbnail.svg';
import { ReactComponent as MusicBandThumbnailGray } from './svg/MusicBandThumbnailGray.svg';
import { ReactComponent as MusicBandThumbnailContrast } from './svg/MusicBandThumbnailContrast.svg';
import { ReactComponent as MusicBandMusicNote } from './svg/MusicBandMusicNote.svg';

// Savannah
import { ReactComponent as Savannah } from './svg/Savannah.svg';
import { ReactComponent as SavannahGray } from './svg/Savannah-gray.svg';
import { ReactComponent as SavannahContrast } from './svg/Savannah-contrast.svg';
import { ReactComponent as SavannahThumbnail } from './svg/SavannahThumbnail.svg';
import { ReactComponent as SavannahThumbnailGray } from './svg/SavannahThumbnail-gray.svg';
import { ReactComponent as SavannahThumbnailContrast } from './svg/SavannahThumbnail-contrast.svg';
import { ReactComponent as SavannahJeep } from './svg/SavannahJeep.svg';
import { ReactComponent as SavannahJeepGray } from './svg/SavannahJeep-gray.svg';
import { ReactComponent as SavannahJeepContrast } from './svg/SavannahJeep-contrast.svg';

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

// Sports
import { ReactComponent as Sports } from './svg/Sports.svg';
import { ReactComponent as SportsGray } from './svg/SportsGray.svg';
import { ReactComponent as SportsContrast } from './svg/SportsContrast.svg';
import { ReactComponent as SportsThumbnail } from './svg/SportsThumbnail.svg';
import { ReactComponent as SportsThumbnailGray } from './svg/SportsThumbnailGray.svg';
import { ReactComponent as SportsThumbnailContrast } from './svg/SportsThumbnailContrast.svg';
import { ReactComponent as SportsGolfCart } from './svg/SportsGolfCart.svg';

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
    'AmusementPark': WorldProperties,
    'AtlanticCanada': WorldProperties,
    'Camping': WorldProperties,
    'DeepOcean': WorldProperties,
    'EuropeTrip': WorldProperties,
    'GroceryStore': WorldProperties,
    'Haunted': WorldProperties,
    'Landmarks': WorldProperties,
    'Marble': WorldProperties,
    'MusicBand': WorldProperties,
    'Savannah': WorldProperties,
    'Sketchpad': WorldProperties,
    'Space': WorldProperties,
    'Sports': WorldProperties
|} = {
    'AmusementPark': {
        background: AmusementPark,
        backgroundGray: AmusementParkGray,
        backgroundContrast: AmusementParkContrast,
        backgroundInfo: {
            A1: 'entrance',
            C1: 'gameBooth',
            D1: 'gameBooth',
            G1: 'pirateShip',
            H1: 'pirateShip',
            J1: 'swingRide',
            K1: 'swingRide',
            L1: 'swingRide',
            A2: 'entrance',
            C2: 'gameBooth',
            D2: 'gameBooth',
            G2: 'pirateShip',
            H2: 'pirateShip',
            J2: 'swingRide',
            K2: 'swingRide',
            L2: 'swingRide',
            A3: 'merryGoRound',
            B3: 'merryGoRound',
            G3: 'pirateShip',
            H3: 'pirateShip',
            A4: 'merryGoRound',
            B4: 'merryGoRound',
            E4: 'waterSlide',
            F4: 'waterSlide',
            J4: 'goKarts',
            K4: 'goKarts',
            L4: 'goKarts',
            E5: 'waterSlide',
            F5: 'waterSlide',
            G5: 'ferrisWheel',
            H5: 'ferrisWheel',
            I5: 'ferrisWheel',
            J5: 'goKarts',
            K5: 'goKarts',
            L5: 'goKarts',
            A6: 'rollerCoaster',
            B6: 'rollerCoaster',
            D6: 'waterPark',
            E6: 'waterPark',
            F6: 'whaleFountain',
            G6: 'ferrisWheel',
            H6: 'ferrisWheel',
            I6: 'ferrisWheel',
            J6: 'goKarts',
            K6: 'goKarts',
            A7: 'rollerCoaster',
            B7: 'rollerCoaster',
            C7: 'rollerCoaster',
            G7: 'ferrisWheel',
            H7: 'ferrisWheel',
            I7: 'ferrisWheel',
            K7: 'snackStand',
            L7: 'snackStand',
            A8: 'rollerCoaster',
            B8: 'rollerCoaster',
            C8: 'rollerCoaster',
            D8: 'rollerCoaster',
            K8: 'snackStand',
            L8: 'snackStand'
        },
        thumbnail: AmusementParkThumbnail,
        thumbnailDark: AmusementParkThumbnail,
        thumbnailGray: AmusementParkThumbnailGray,
        thumbnailContrast: AmusementParkThumbnailContrast,
        character: AmusementParkTrain,
        characterGray: AmusementParkTrain,
        characterContrast: AmusementParkTrain,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'AtlanticCanada': {
        background: AtlanticCanada,
        backgroundGray: AtlanticCanadaGray,
        backgroundContrast: AtlanticCanadaContrast,
        backgroundInfo: {
            A1: 'water',
            B1: 'water',
            C1: 'shore',
            D1: 'lighthouse',
            E1: 'shore',
            F1: 'shore',
            G1: 'water',
            H1: 'water',
            I1: 'water',
            J1: 'shore',
            K1: 'fishProcessingPlant',
            L1: 'fishProcessingPlant',
            A2: 'water',
            B2: 'water',
            C2: 'shore',
            D2: 'lighthouse',
            E2: 'water',
            F2: 'water',
            G2: 'storms',
            H2: 'storms',
            I2: 'storms',
            J2: 'water',
            K2: 'water',
            L2: 'fishProcessingPlant',
            A3: 'water',
            B3: 'water',
            C3: 'water',
            D3: 'water',
            E3: 'water',
            F3: 'water',
            G3: 'storms',
            H3: 'storms',
            I3: 'storms',
            J3: 'shoal',
            K3: 'shoal',
            L3: 'water',
            A4: 'shore',
            B4: 'water',
            C4: 'water',
            D4: 'iceberg',
            E4: 'water',
            F4: 'whale',
            G4: 'whale',
            H4: 'water',
            I4: 'water',
            J4: 'shoal',
            K4: 'shoal',
            L4: 'water',
            A5: 'house',
            B5: 'water',
            C5: 'water',
            D5: 'water',
            E5: 'whale',
            F5: 'whale',
            G5: 'iceberg',
            H5: 'water',
            I5: 'water',
            J5: 'water',
            K5: 'sailboat',
            L5: 'sailboat',
            A6: 'house',
            B6: 'rowingBoatOnTheShore',
            C6: 'water',
            D6: 'water',
            E6: 'iceberg',
            F6: 'water',
            G6: 'water',
            H6: 'water',
            I6: 'water',
            J6: 'water',
            K6: 'sailboat',
            L6: 'sailboat',
            A7: 'land',
            B7: 'land',
            C7: 'rowingBoatOnTheShore',
            D7: 'water',
            E7: 'water',
            F7: 'water',
            G7: 'water',
            H7: 'water',
            I7: 'fogBank',
            J7: 'fogBank',
            K7: 'fogBank',
            L7: 'fogBank',
            A8: 'trees',
            B8: 'house',
            C8: 'house',
            D8: 'house',
            E8: 'trees',
            F8: 'water',
            G8: 'water',
            H8: 'fogBank',
            I8: 'fogBank',
            J8: 'fogBank',
            K8: 'fogBank',
            L8: 'fogBank'
        },
        thumbnail: AtlanticCanadaThumbnail,
        thumbnailDark: AtlanticCanadaThumbnail,
        thumbnailGray: AtlanticCanadaThumbnailGray,
        thumbnailContrast: AtlanticCanadaThumbnailContrast,
        character: AtlanticCanadaCapeIslander,
        characterGray: AtlanticCanadaCapeIslanderGray,
        characterContrast: AtlanticCanadaCapeIslanderContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
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
    'EuropeTrip': {
        background: EuropeTrip,
        backgroundGray: EuropeTripGray,
        backgroundContrast: EuropeTripContrast,
        backgroundInfo: {
            C1: 'C1',
            E1: 'E1',
            F1: 'F1',
            G1: 'G1',
            H1: 'H1',
            I1: 'I1',
            J1: 'J1',
            C2: 'C2',
            D2: 'D2',
            E2: 'E2',
            F2: 'F2',
            G2: 'G2',
            H2: 'H2',
            I2: 'I2',
            C3: 'C3',
            D3: 'D3',
            E3: 'E3',
            F3: 'F3',
            G3: 'G3',
            H3: 'H3',
            I3: 'I3',
            J3: 'J3',
            D4: 'D4',
            E4: 'E4',
            F4: 'F4',
            G4: 'G4',
            H4: 'H4',
            I4: 'I4',
            J4: 'J4',
            K4: 'K4',
            L4: 'L4',
            C5: 'C5',
            D5: 'D5',
            E5: 'E5',
            F5: 'F5',
            G5: 'G5',
            H5: 'H5',
            I5: 'I5',
            J5: 'J5',
            K5: 'K5',
            L5: 'L5',
            B6: 'B6',
            C6: 'C6',
            D6: 'D6',
            E6: 'E6',
            F6: 'F6',
            G6: 'G6',
            H6: 'H6',
            I6: 'I6',
            J6: 'J6',
            K6: 'K6',
            B7: 'B7',
            C7: 'C7',
            D7: 'D7',
            E7: 'E7',
            F7: 'F7',
            G7: 'G7',
            H7: 'H7',
            I7: 'I7',
            J7: 'J7',
            K7: 'K7',
            L7: 'L7',
            G8: 'G8',
            H8: 'H8',
            I8: 'I8',
            J8: 'J8',
            K8: 'K8',
            L8: 'L8',
        },
        thumbnail: EuropeTripThumbnail,
        thumbnailDark: EuropeTripThumbnail,
        thumbnailGray: EuropeTripThumbnailGray,
        thumbnailContrast: EuropeTripThumbnailContrast,
        character: EuropeTripPlane,
        characterGray: EuropeTripPlaneGray,
        characterContrast: EuropeTripPlaneContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'GroceryStore': {
        background: GroceryStore,
        backgroundGray: GroceryStoreGray,
        backgroundContrast: GroceryStoreContrast,
        backgroundInfo: {
            A1: 'ceilingLight',
            B1: 'ceilingLight',
            C1: 'ceilingLight',
            E1: 'refrigerator',
            F1: 'refrigerator',
            G1: 'refrigerator',
            H1: 'refrigerator',
            J1: 'jars',
            K1: 'cans',
            L1: 'cans',
            E2: 'steak',
            F2: 'groundBeef',
            G2: 'chicken',
            H2: 'fish',
            J3: 'bottles',
            K3: 'pasta',
            L3: 'bagOfRice',
            A4: 'bread',
            B4: 'bread',
            A5: 'onions',
            B5: 'potatoes',
            E5: 'pineapples',
            F5: 'apples',
            G5: 'pears',
            H5: 'oranges',
            J5: 'refrigerator',
            K5: 'refrigerator',
            L5: 'refrigerator',
            A6: 'cucumbers',
            B6: 'tomatoes',
            C6: 'eggplants',
            E6: 'watermelons',
            F6: 'strawberries',
            G6: 'bananas',
            H6: 'grapes',
            J6: 'milk',
            K6: 'chocolateMilk',
            L6: 'orangeJuice',
            A7: 'carrots',
            B7: 'greenVegetables',
            C7: 'broccoli',
            J7: 'eggs',
            K7: 'bottles',
            L7: 'cheese',
            J8: 'yogurt',
            K8: 'tofu',
            L8: 'tofu'
        },
        thumbnail: GroceryStoreThumbnail,
        thumbnailDark: GroceryStoreThumbnail,
        thumbnailGray: GroceryStoreThumbnailGray,
        thumbnailContrast: GroceryStoreThumbnailContrast,
        character: GroceryStoreCart,
        characterGray: GroceryStoreCartGray,
        characterContrast: GroceryStoreCartContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Haunted': {
        background: Haunted,
        backgroundGray: HauntedGray,
        backgroundContrast: HauntedContrast,
        backgroundInfo: {
            C1: 'painting',
            D1: 'painting',
            E1: 'painting',
            F1: 'deerSkull',
            G1: 'deerSkull',
            H1: 'painting',
            I1: 'painting',
            J1: 'painting',
            A2: 'stairs',
            B2: 'stairs',
            D2: 'painting',
            E2: 'painting',
            F2: 'painting',
            G2: 'painting',
            H2: 'painting',
            I2: 'painting',
            J2: 'mirror',
            A3: 'stairs',
            B3: 'stairs',
            C3: 'stairs',
            J3: 'mirror',
            A4: 'shelf',
            B4: 'shelf',
            C4: 'stairs',
            D4: 'stairs',
            E4: 'stairs',
            F4: 'stairs',
            G4: 'stairs',
            H4: 'stairs',
            A5: 'shelf',
            B5: 'shelf',
            C5: 'shelf',
            D5: 'stairs',
            E5: 'stairs',
            F5: 'stairs',
            G5: 'stairs',
            H5: 'stairs',
            I5: 'stairs',
            J5: 'stairs',
            K5: 'stairs',
            A6: 'shelf',
            B6: 'shelf',
            C6: 'shelf',
            E6: 'fireplace',
            F6: 'fireplace',
            G6: 'fireplace',
            H6: 'chair',
            I6: 'stairs',
            J6: 'stairs',
            K6: 'stairs',
            L6: 'stairs',
            A7: 'shelf',
            B7: 'shelf',
            C7: 'shelf',
            E7: 'fireplace',
            F7: 'fireplace',
            G7: 'fireplace',
            H7: 'chair',
            I7: 'stairs',
            J7: 'stairs',
            K7: 'stairs',
            L7: 'stairs',
            A8: 'shelf',
            B8: 'shelf',
            C8: 'shelf',
            J8: 'stairs',
            K8: 'stairs',
            L8: 'stairs'
        },
        thumbnail: HauntedThumbnail,
        thumbnailDark: HauntedThumbnail,
        thumbnailGray: HauntedThumbnailGray,
        thumbnailContrast: HauntedThumbnailContrast,
        character: HauntedFlashlight,
        characterGray: HauntedFlashlight,
        characterContrast: HauntedFlashlight,
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
    'Marble': {
        background: MarbleWorld,
        backgroundGray: MarbleWorldGray,
        backgroundContrast: MarbleWorldContrast,
        backgroundInfo : {
            A1: 'bricks',
            B1: 'bricks',
            C1: 'bricks',
            E1: 'bricks',
            F1: 'bricks',
            G1: 'bricks',
            H1: 'bricks',
            I1: 'bricks',
            J1: 'bricks',
            K1: 'bricks',
            I2: 'bricks',
            J2: 'bricks',
            A3: 'bricks',
            C3: 'bricks',
            E3: 'bricks',
            F3: 'bricks',
            J3: 'bricks',
            L3: 'bricks',
            A4: 'bricks',
            C4: 'bricks',
            J4: 'bricks',
            L4: 'bricks',
            A5: 'bricks',
            C5: 'bricks',
            G5: 'bricks',
            H5: 'bricks',
            I5: 'bricks',
            J5: 'bricks',
            L5: 'bricks',
            A6: 'bricks',
            C6: 'bricks',
            D6: 'bricks',
            G6: 'bricks',
            H6: 'bricks',
            I6: 'bricks',
            J6: 'bricks',
            L6: 'bricks',
            A7: 'bricks',
            E7: 'bricks',
            L7: 'bricks',
            A8: 'bricks',
            B8: 'bricks',
            E8: 'bricks',
            F8: 'bricks',
            G8: 'bricks',
            H8: 'bricks',
            I8: 'bricks',
            K8: 'bricks',
            L8: 'bricks'
        },
        thumbnail: MarbleThumbnail,
        thumbnailDark: MarbleThumbnail,
        thumbnailGray: MarbleThumbnailGray,
        thumbnailContrast: MarbleThumbnailContrast,
        character: Marble,
        characterGray: Marble,
        characterContrast: Marble,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: false
    },
    'MusicBand': {
        background: MusicBand,
        backgroundGray: MusicBandGray,
        backgroundContrast: MusicBandContrast,
        backgroundInfo : {
            B1: 'spotlight',
            E1: 'spotlight',
            H1: 'spotlight',
            K1: 'spotlight',
            H2: 'drumKit',
            J2: 'saxophone',
            K2: 'saxophone',
            B3: 'guitar',
            C3: 'guitar',
            F3: 'drumKit',
            G3: 'drumKit',
            H3: 'drumKit',
            J3: 'saxophone',
            K3: 'saxophone',
            B4: 'guitar',
            C4: 'guitar',
            F4: 'drumKit',
            G4: 'drumKit',
            H4: 'drumKit',
            F5: 'drumKit',
            G5: 'drumKit',
            H5: 'drumKit',
            A6: 'tambourine',
            F6: 'microphone',
            H6: 'synthesizer',
            I6: 'synthesizer',
            J6: 'synthesizer',
            K6: 'synthesizer',
            A7: 'loudspeaker',
            C7: 'xylophone',
            D7: 'xylophone',
            F7: 'microphone',
            H7: 'synthesizer',
            I7: 'synthesizer',
            J7: 'synthesizer',
            L7: 'loudspeaker',
            A8: 'loudspeaker',
            F8: 'microphone',
            L8: 'loudspeaker'
        },
        thumbnail: MusicBandThumbnail,
        thumbnailDark: MusicBandThumbnail,
        thumbnailGray: MusicBandThumbnailGray,
        thumbnailContrast: MusicBandThumbnailContrast,
        character: MusicBandMusicNote,
        characterGray: MusicBandMusicNote,
        characterContrast: MusicBandMusicNote,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Savannah': {
        background: Savannah,
        backgroundGray: SavannahGray,
        backgroundContrast: SavannahContrast,
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
        thumbnail: SavannahThumbnail,
        thumbnailDark: SavannahThumbnail,
        thumbnailGray: SavannahThumbnailGray,
        thumbnailContrast: SavannahThumbnailContrast,
        character: SavannahJeep,
        characterGray: SavannahJeepGray,
        characterContrast: SavannahJeepContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
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
    },
    'Sports': {
        background: Sports,
        backgroundGray: SportsGray,
        backgroundContrast: SportsContrast,
        backgroundInfo: {
            A1: 'badmintonShuttlecock',
            C1: 'basketball',
            F1: 'runningShoes',
            H1: 'curlingStone',
            J1: 'golfBall',
            L1: 'martialArtsUniform',
            E2: 'skisAndSkiPoles',
            I2: 'volleyballBall',
            L2: 'martialArtsUniform',
            C3: 'cricketBatAndBall',
            E3: 'skisAndSkiPoles',
            G3: 'football',
            K3: 'bowlingBallAndPins',
            A4: 'hockeyStickAndPuck',
            C4: 'cricketBatAndBall',
            H4: 'boxingGloves',
            J4: 'tennisRacketAndBall',
            L4: 'iceSkates',
            A5: 'hockeyStickAndPuck',
            E5: 'baseballGloveAndBall',
            G5: 'singlet',
            J5: 'tennisRacketAndBall',
            B6: 'soccerBall',
            G6: 'singlet',
            L6: 'rowingBoat',
            D7: 'bicycle',
            E7: 'bicycle',
            F7: 'bicycle',
            J7: 'fieldHockeyStickAndBall',
            L7: 'rowingBoat',
            A8: 'swimmingGoggles',
            B8: 'swimmingGoggles',
            D8: 'bicycle',
            E8: 'bicycle',
            F8: 'bicycle',
            H8: 'tableTennisRacket',
            J8: 'fieldHockeyStickAndBall',
            L8: 'rowingBoat'
        },
        thumbnail: SportsThumbnail,
        thumbnailDark: SportsThumbnail,
        thumbnailGray: SportsThumbnailGray,
        thumbnailContrast: SportsThumbnailContrast,
        character: SportsGolfCart,
        characterGray: SportsGolfCart,
        characterContrast: SportsGolfCart,
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
