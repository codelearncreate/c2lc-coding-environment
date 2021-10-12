// @flow

import React from 'react';
import { Modal } from 'react-bootstrap';
import './ModalHeader.scss';

type ModalHeaderProps = {
    id: string,
    title: string,
    children?: any
};

export default class ModalHeader extends React.Component<ModalHeaderProps, {}> {
    render() {
        return (
            <Modal.Title className='ModalHeader' id={this.props.id}>
                {this.props.children}
                {this.props.title}
            </Modal.Title>
        );
    }
}
