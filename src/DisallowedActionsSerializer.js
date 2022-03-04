// @flow
/*

    Store a register of "disallowed actions" in the URL, so that the choices
    made in the "simplification" menu are persisted.

*/
import type { ActionToggleRegister } from './types';

export default class DisallowedActionsSerializer {

    serialize(actionToggleRegister: ActionToggleRegister): string {
        let serializeDisallowedActions = '';
        for (const [actionKey, isDisallowed] of Object.entries(actionToggleRegister)) {
            if (isDisallowed) {
                switch (actionKey) {
                    case ('forward1') :
                        serializeDisallowedActions += '1';
                        break;
                    case ('forward2') :
                        serializeDisallowedActions += '2';
                        break;
                    case ('forward3') :
                        serializeDisallowedActions += '3';
                        break;
                    case ('backward1') :
                        serializeDisallowedActions += '4';
                        break;
                    case ('backward2') :
                        serializeDisallowedActions += '5';
                        break;
                    case ('backward3') :
                        serializeDisallowedActions += '6';
                        break;
                    case ('left45') :
                        serializeDisallowedActions += 'A';
                        break;
                    case ('left90') :
                        serializeDisallowedActions += 'B';
                        break;
                    case ('left180') :
                        serializeDisallowedActions += 'D';
                        break;
                    case ('right45') :
                        serializeDisallowedActions += 'a';
                        break;
                    case ('right90') :
                        serializeDisallowedActions += 'b';
                        break;
                    case ('right180') :
                        serializeDisallowedActions += 'd';
                        break;
                    case ('loop') :
                        serializeDisallowedActions += 'l';
                        break;
                    default:
                        throw new Error(`Unrecognized actionKey when serializing actionKey: ${actionKey}`);
                }
            }
        }
        return serializeDisallowedActions;
    }

    deserialize(disallowedActionsText: string): ActionToggleRegister {
        const actionToggleRegister = {};
        for (let i=0; i<disallowedActionsText.length; i++) {
            switch(disallowedActionsText.charAt(i)) {
                case '1':
                    actionToggleRegister['forward1'] = true;
                    break;
                case '2':
                    actionToggleRegister['forward2'] = true;
                    break;
                case '3':
                    actionToggleRegister['forward3'] = true;
                    break;
                case '4':
                    actionToggleRegister['backward1'] = true;
                    break;
                case '5':
                    actionToggleRegister['backward2'] = true;
                    break;
                case '6':
                    actionToggleRegister['backward3'] = true;
                    break;
                case 'A':
                    actionToggleRegister['left45'] = true;
                    break;
                case 'B':
                    actionToggleRegister['left90'] = true;
                    break;
                case 'D':
                    actionToggleRegister['left180'] = true;
                    break;
                case 'a':
                    actionToggleRegister['right45'] = true;
                    break;
                case 'b':
                    actionToggleRegister['right90'] = true;
                    break;
                case 'd':
                    actionToggleRegister['right180'] = true;
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