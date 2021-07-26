// @flow

import type {AudioManager} from './types';

export default class FakeAudioManager implements AudioManager {
    //$FlowFixMe: getFeedbackIsPlaying return type issue
    getFeedbackIsPlaying() {};
    playFeedbackAnnouncement() {};
    playPreviewAnnouncement() {};
    playStringMessage() {};
    playSoundForCharacterState() {};
    setAnnouncementsEnabled() {};
    setAudioEnabled() {};
    setFeedbackIsPlaying() {};
};
