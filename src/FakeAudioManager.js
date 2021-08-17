// @flow

import type {AudioManager} from './types';

export default class FakeAudioManager implements AudioManager {
    playFeedbackAnnouncement() {};
    playPreviewAnnouncement() {};
    playStringMessage() {};
    playSoundForCharacterState() {};
    setAnnouncementsEnabled() {};
    setAudioEnabled() {};
};
