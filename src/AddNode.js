// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import classNames from 'classnames';
import './AddNode.scss';

type AddNodeProps = {
    expandedMode: boolean,
    programStepNumber: number,
    disabled: boolean,
    'aria-label': string,
    isDraggingCommand: boolean,
    closestAddNodeIndex: number,
    onClick: (stepNumber: number) => void
};

const AddNode = React.forwardRef<AddNodeProps, HTMLDivElement>(
    (props, ref) => {
        const handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
            const stepNumber = parseInt(e.currentTarget.dataset.stepnumber, 10);
            props.onClick(stepNumber);
        };

        /* istanbul ignore next */
        const addNodeClasses = classNames(
            props.isDraggingCommand && 'AddNode--is-dragging-command'
        );

        const isNearestDragNode = ( props.programStepNumber === props.closestAddNodeIndex);

        if (props.expandedMode || isNearestDragNode) {
            return (
                <div className={addNodeClasses}>
                    <AriaDisablingButton
                        className={"focus-announcement AddNode__expanded-button" + (isNearestDragNode ? " AddNode__expanded-button--isDragTarget" : "")}
                        data-stepnumber={props.programStepNumber}
                        // $FlowFixMe: Use something less generic here.
                        ref={ref}
                        disabled={props.disabled}
                        aria-label={props['aria-label']}
                        onClick={handleClick}
                    >
                        <AddIcon />
                    </AriaDisablingButton>
                </div>
            );
        } else {
            return (
                <div ref={ref} className={addNodeClasses}>
                    <div className='AddNode__collapsed-icon'>
                        <AddIcon />
                    </div>
                </div>
            );
        }
    }
);

export default AddNode;
