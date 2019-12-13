// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Row } from 'react-bootstrap';
import CommandPaletteCategory from './CommandPaletteCategory';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('number of commands rendered by CommandPaletteCategory should be equal to the number of CommandPaletteCommand', () => {
    const emptyCommandsWrapper = shallow(
        <CommandPaletteCategory eventKey='movements' title='Movements'>
        </CommandPaletteCategory>
    );

    let commands = emptyCommandsWrapper.find(CommandPaletteCommand);
    expect(commands).toHaveLength(0);

    const oneCommandsWrapper = shallow(
        <CommandPaletteCategory eventKey='movements' title='Movements'>
            <CommandPaletteCommand
                commandName='forward'
                icon={null}
                selectedCommandName={null}
                onChange={() => {}}/>
        </CommandPaletteCategory>
    );
    commands = oneCommandsWrapper.find(CommandPaletteCommand);
    expect(commands).toHaveLength(1);

    const threeCommandsWrapper = shallow(
        <CommandPaletteCategory eventKey='movements' title='Movements'>
            <CommandPaletteCommand
                commandName='forward'
                icon={null}
                selectedCommandName={null}
                onChange={() => {}}/>
            <CommandPaletteCommand
                commandName='left'
                icon={null}
                selectedCommandName={null}
                onChange={() => {}}/>
            <CommandPaletteCommand
                commandName='right'
                icon={null}
                selectedCommandName={null}
                onChange={() => {}}/>
        </CommandPaletteCategory>
    );

    commands = threeCommandsWrapper.find(CommandPaletteCommand);
    expect(commands).toHaveLength(3);
});
