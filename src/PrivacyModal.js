// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';

import {ReactComponent as PrivacyIcon} from './svg/PrivacyIcon.svg'

import './PrivacyModal.scss';

type PrivacyModalProps = {
    intl: IntlShape,
    focusOnCloseSelector: string,
    onClose: () => void,
    show: boolean
}

class PrivacyModal extends React.Component<PrivacyModalProps, {}> {
    render() {
        const closeButtonProperties = {
            label: this.props.intl.formatMessage({ id: 'PrivacyModal.close'} ),
            isPrimary: true,
            onClick: this.props.onClose
        };

        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'.TextButton--primaryButton'}
                focusOnCloseSelector={this.props.focusOnCloseSelector}
                onClose={this.props.onClose}
                buttonProperties={[closeButtonProperties]}
            >
                <ModalHeader
                    id='PrivacyModal__header'
                    title={this.props.intl.formatMessage({ id: 'PrivacyModal.title'})}
                >
                    <PrivacyIcon aria-hidden='true'/>
                </ModalHeader>

                <ModalBody>
                    <div className='PrivacyModal__content'>
                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section010.Heading'})}</h5>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section010.block010'})}
                        </p>
                        <p>{this.props.intl.formatMessage({ id: 'PrivacyModal.section010.block020'})}</p>

                        <ul>
                            <li>
                                {this.props.intl.formatMessage({ id: 'PrivacyModal.section010.block030.item010'})}
                            </li>
                            <li>
                                {this.props.intl.formatMessage({ id: 'PrivacyModal.section010.block030.item020'})}
                            </li>
                            <li>
                                {this.props.intl.formatMessage({ id: 'PrivacyModal.section010.block030.item030'})}
                            </li>
                        </ul>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.Heading'})}</h5>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block010'})}
                        </p>

                        <ul>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item010'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item020'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item030'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item040'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item050'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item060'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item070'})}</li>
                            <li>{this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block020.item080'})}</li>
                        </ul>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section020.block030'})}
                        </p>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section030.Heading'})}</h5>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section030.block010'})}
                        </p>

                        <ul>
                            <li>
                                {this.props.intl.formatMessage({ id: 'PrivacyModal.section030.block020.item010'})}
                            </li>
                            <li>
                                {this.props.intl.formatMessage({ id: 'PrivacyModal.section030.block020.item020'})}
                            </li>
                        </ul>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section030.block030'})}
                        </p>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section040.Heading'})}</h5>

                        <p>{this.props.intl.formatMessage({ id: 'PrivacyModal.section040.block010'})}</p>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section050.Heading'})}</h5>

                        <p dangerouslySetInnerHTML={
                            {__html: this.props.intl.formatMessage(
                                { id: 'PrivacyModal.section050.block010'},
                                { contactLink: `<a href="https://weavly.org/about/" target='_blank' rel='noopener noreferrer'>${this.props.intl.formatMessage({ id: 'PrivacyModal.contactUs' })}</a>` }
                            )}
                        }>
                        </p>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section060.Heading'})}</h5>

                        <p>
                            {this.props.intl.formatMessage({ id: 'PrivacyModal.section060.block010'})}
                        </p>

                        <h5>{this.props.intl.formatMessage({ id: 'PrivacyModal.section070.Heading'})}</h5>

                        <p dangerouslySetInnerHTML={
                            {__html: this.props.intl.formatMessage(
                                { id: 'PrivacyModal.section070.block010'},
                                { contactLink: `<a href="https://weavly.org/about/" target='_blank' rel='noopener noreferrer'>${this.props.intl.formatMessage({ id: 'PrivacyModal.contactUs' })}</a>` }
                            )}
                        }>
                        </p>
                    </div>
                </ModalBody>
            </ModalWithFooter>

        );
    }
}

export default injectIntl(PrivacyModal);
