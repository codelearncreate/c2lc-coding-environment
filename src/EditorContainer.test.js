// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import EditorContainer from './EditorContainer';
import ProgramBlockEditor from './ProgramBlockEditor';
import ProgramTextEditor from './ProgramTextEditor';
import TextSyntax from './TextSyntax';



configure({ adapter: new Adapter()});

test('check if ProgramTextEditor component is rendering when EditorContainer has mode of text', () => {
    const mockChangeHandler = jest.fn();
    const mockSelectHandler = jest.fn();
    const wrapper =
        shallow(<EditorContainer
                    program={[]}
                    syntax={new TextSyntax()}
                    mode='text'
                    selectedAction={null}
                    runButtonDisabled={false}
                    onClickRunButton={() => {}}
                    onSelectAction={mockSelectHandler}
                    onChange={mockChangeHandler}/>);
    expect(wrapper.find(ProgramTextEditor)).toHaveLength(1);
});

test('check if ProgramBlockEditor component is rendering when EditorContainer has mode of block', () => {
    const mockChangeHandler = jest.fn();
    const mockSelectHandler = jest.fn();
    const wrapper =
        shallow(<EditorContainer
                    program={[]}
                    syntax={new TextSyntax()}
                    mode='block'
                    selectedAction={null}
                    runButtonDisabled={false}
                    onClickRunButton={() => {}}
                    onSelectAction={mockSelectHandler}
                    onChange={mockChangeHandler}/>);
    const BlockEditor = wrapper.find(ProgramBlockEditor);
    expect(BlockEditor).toHaveLength(1);
})


