// @flow

import React from 'react';
import './ModalBody.css';

type ModalBodyProps = {
    children: any
}

class ModalBody extends React.Component<ModalBodyProps,{}> {
    render() {
        return (
            <div className='ModalBody'>
                {this.props.children}
            </div>
        )
    }
}

export default ModalBody;