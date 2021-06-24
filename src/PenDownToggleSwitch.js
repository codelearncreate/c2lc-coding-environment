// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as PenDownIcon } from './svg/PenDown.svg';
import type {IntlShape} from 'react-intl';
import './PenDownToggleSwitch.scss';

type PenDownToggleSwitchProps = {
    intl: IntlShape,
    value: boolean,
    onChange: (value: boolean) => void
};

class PenDownToggleSwitch extends React.Component<PenDownToggleSwitchProps, {}> {
    render() {
        return (
            <ToggleSwitch
                ariaLabel={this.props.intl.formatMessage({id: 'PenDownToggleSwitch.penDown'})}
                value={this.props.value}
                contentsTrue={<PenDownIcon />}
                contentsFalse={<PenDownIcon />}
                onChange={this.props.onChange}
                className='PenDownToggleSwitch'/>
        );
    }
};

export default injectIntl(PenDownToggleSwitch);
