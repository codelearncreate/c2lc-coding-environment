// @flow

import type {IntlShape} from 'react-intl';
import type {ProgramBlock} from './types';

type AnnouncementData = {|
    messageIdSuffix: string,
    values: any
|};

export default class AnnouncementBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    buildSelectActionAnnouncement(action: string): AnnouncementData {
        let commandType = null;
        if (action === 'loop') {
            commandType = this.intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            commandType = this.intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'actionSelected',
            values: {
                commandType: commandType,
                command: this.intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildAddStepAnnouncement(action: string): AnnouncementData {
        let commandType = null;
        if (action === 'loop') {
            commandType = this.intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            commandType = this.intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'add',
            values: {
                commandType: commandType,
                command: this.intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildDeleteStepAnnouncement(programBlock: ProgramBlock): AnnouncementData {
        let commandType = null;
        if (programBlock.block === 'startLoop' || programBlock.block === 'endLoop') {
            commandType = this.intl.formatMessage({
                id: "Announcement.control"
            });
        } else {
            commandType = this.intl.formatMessage({
                id: "Announcement.movement"
            });
        }
        return {
            messageIdSuffix: 'delete',
            values: {
                commandType: commandType,
                command: this.intl.formatMessage(
                    {
                        id: `Announcement.${programBlock.block}`
                    },
                    {
                        loopLabel: programBlock.label
                    }
                )
            }
        };
    }

    buildReplaceStepAnnouncement(programBlock: ProgramBlock,
        selectedAction: string): AnnouncementData {

        return {
            messageIdSuffix: 'replace',
            values: {
                oldCommand: this.intl.formatMessage({
                    id: `Announcement.${programBlock.block}`
                }),
                newCommand: this.intl.formatMessage({
                    id: `Announcement.${selectedAction}`
                })
            }
        };
    }
};
