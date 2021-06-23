// @flow

import type {AudioManager} from './types';

export default class FakeAudioManager implements AudioManager {
    playAnnouncement() {};
    playStringMessage() {};
    playSoundForCharacterState() {};
    setAnnouncementsEnabled() {};
    setAudioEnabled() {};
};
