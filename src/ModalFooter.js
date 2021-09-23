// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import './ModalFooter.scss';

type ModalFooterProps = {
    hasCancel: boolean,
    onClickCancel?: () => void,
    onClickDone: () => void
};

class ModalFooter extends React.Component<ModalFooterProps, {}> {
    render() {
        return (
            <div className="ModalFooter">
                {this.props.hasCancel &&
                    <Button className="ModalFooter__cancelButton" onClick={this.props.onClickCancel}>
                        <FormattedMessage id="ModalFooter.Cancel"/>
                    </Button>
                }
                <Button className="ModalFooter__doneButton" onClick={this.props.onClickDone}>
                    <FormattedMessage id="ModalFooter.Save"/>
                </Button>
            </div>
        );
    }
}

export default injectIntl(ModalFooter);
