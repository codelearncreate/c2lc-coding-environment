// @flow

import type {AudioManager} from './types';

export default class FakeAudioManager implements AudioManager {
    playAnnouncement() {};
    playSoundForCharacterState() {};
    setAnnouncementsEnabled() {};
    setAudioEnabled() {};
    setWorld() {};
    startTone() {};
};
