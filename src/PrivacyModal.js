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
                focusOnCloseSelector={'.App__PrivacyModal__toggle-button'}
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
                        <h5>Updated December 5th, 2023</h5>

                        <p>
                            At Weavly, we believe that privacy is a fundamental human right, and acknowledge how important
                            it is to our community—especially with regards to both children and parents.
                        </p>
                        <p>This page explains:</p>

                        <ul>
                            <li>
                                What type of information we store on our website (http://create.weavly.org/)
                            </li>
                            <li>
                                How that information is used and processed
                            </li>
                            <li>
                                How we keep your information safe
                            </li>
                        </ul>

                        <h5>What information does Weavly store?</h5>

                        <p>
                            As you use Weavly, we may store information on how Weavly is accessed and used by you. We store
                            the following information independently on every browser/device pair that you use Weavly on:
                        </p>

                        <ul>
                            <li>Your prefered settings for display colour theme and keyboard shortcuts</li>
                            <li>Your visible set of action blocks on the action panel</li>
                            <li>Your selected background for the scene</li>
                            <li>Your created program</li>
                            <li>Any line that is drawn on the scene as a result of running your program</li>
                            <li>The last position of your character on the scene</li>
                            <li>The starting position of your character</li>
                            <li>The version of Weavly that was used</li>
                        </ul>

                        <p>
                            You can delete any information that Weavly has generated from your usage by clearing your
                            browser's cache and local storage. Check your browser's documentation for details.
                        </p>

                        <h5>How does Weavly use this information?</h5>

                        <p>
                            The generated information is kept in a local storage on your device to make your use of Weavly
                            more convenient:
                        </p>

                        <ul>
                            <li>
                                Your settings for the coding environment are stored so you don't have to adjust them every
                                time you launch Weavly
                            </li>
                            <li>
                                If you happen to accidentally or intentionally close your browser, the coding environment
                                will be the same as when you left it for the next time you launch Weavly
                            </li>
                        </ul>

                        <p>
                            Although storing your information in the browser makes it convenient
                            for every time you access Weavly, it may cause problems on shared computers. As a result,
                            someone that uses the computer after you may be able to access your Weavly settings and program.
                        </p>

                        <h5>How do we keep your information safe?</h5>

                        <p>The security of your data is important to us, but please keep in mind that no method of
                            electronic storage is 100% secure. We currently use browser local storage to store the specified
                            data. The information is stored in the browser by domain (create.weavly.org) and only code
                            running from that domain may access it. Thus, other websites cannot access the data. However,
                            local storage is not encrypted on disk and someone with access to the device could get access to
                            the data.</p>

                        <h5>Children's Privacy</h5>

                        <p>
                            We do not knowingly collect personally identifiable information from anyone under the age of 18.
                            If you are a parent or guardian and you have become aware that we have collected Personal Data
                            from your children without verification of parental consent, we can take steps to remove that
                            information from our servers. Please <a href="https://weavly.org/about/" target='_blank' rel='noopener noreferrer'>contact us</a>.
                        </p>

                        <h5>Changes to This Privacy Policy</h5>

                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                            the new Privacy Policy on this page. We will let you know of any changes becoming effective by
                            updating the “effective date” at the top of this Privacy Policy. You are advised to review this
                            Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when
                            they are posted on this page.
                        </p>

                        <h5>Contact Us</h5>

                        <p>
                            If you have any questions about this Privacy Policy,
                            please <a href="https://weavly.org/about/" target='_blank' rel='noopener noreferrer'>contact
                            us</a>.
                        </p>
                    </div>
                </ModalBody>
            </ModalWithFooter>

        );
    }
}

export default injectIntl(PrivacyModal);
