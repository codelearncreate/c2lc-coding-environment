// @flow
/*

    Store a register of "disallowed actions" in the URL, so that the choices
    made in the "simplification" menu are persisted.

*/
import type { ActionToggleRegister } from './types';

export default class DisallowedActionsSerializer {

    serialize(actionToggleRegister: ActionToggleRegister): string {
        let serializedDisallowedActions = '';
        for (const [actionKey, isDisallowed] of Object.entries(actionToggleRegister)) {
            if (isDisallowed) {
                switch (actionKey) {
                    case ('forward1') :
                        serializedDisallowedActions += '1';
                        break;
                    case ('backward1') :
                        serializedDisallowedActions += '4';
                        break;
                    case ('left45') :
                        serializedDisallowedActions += 'A';
                        break;
                    case ('left90') :
                        serializedDisallowedActions += 'B';
                        break;
                    case ('right45') :
                        serializedDisallowedActions += 'a';
                        break;
                    case ('right90') :
                        serializedDisallowedActions += 'b';
                        break;
                    case ('loop') :
                        serializedDisallowedActions += 'l';
                        break;
                    default:
                        throw new Error(`Unrecognized actionKey when serializing actionKey: ${actionKey}`);
                }
            }
        }
        return serializedDisallowedActions;
    }

    deserialize(disallowedActionsText: string): ActionToggleRegister {
        const actionToggleRegister = {};
        for (let i=0; i<disallowedActionsText.length; i++) {
            switch(disallowedActionsText.charAt(i)) {
                case '1':
                    actionToggleRegister['forward1'] = true;
                    break;
                case '4':
                    actionToggleRegister['backward1'] = true;
                    break;
                case 'A':
                    actionToggleRegister['left45'] = true;
                    break;
                case 'B':
                    actionToggleRegister['left90'] = true;
                    break;
                case 'a':
                    actionToggleRegister['right45'] = true;
                    break;
                case 'b':
                    actionToggleRegister['right90'] = true;
                    break;
                case 'l':
                    actionToggleRegister['loop'] = true;
                    break;
                default:
                    throw new Error(`Unrecognized disallowedActions text when deserialize text: ${disallowedActionsText.charAt(i)}`);
            }
        }
        return actionToggleRegister;
    }
}