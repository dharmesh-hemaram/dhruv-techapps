import { SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';

import CommonEvents from './common.events';

const WINDOW_COMMANDS = ['copy', 'cut', 'delete', 'paste', 'selectAll', 'open', 'close', 'focus', 'blur', 'print', 'stop', 'moveBy', 'moveTo'];

export const WindowCommandEvents = (() => {
  const execCommand = (commands: Array<string | Event>, value: string) => {
    commands.forEach((command) => {
      switch (command) {
        case 'close':
          window.close();
          break;
        case 'focus':
          window.focus();
          break;
        case 'blur':
          window.blur();
          break;
        case 'print':
          window.print();
          break;
        case 'stop':
          window.stop();
          break;
        case 'moveBy':
          // eslint-disable-next-line no-case-declarations
          const [x, y] = value.split('::')[2].split(',');
          window.moveBy(Number(x), Number(y));
          break;
        case 'moveTo':
          // eslint-disable-next-line no-case-declarations
          const [xAxis, yAxis] = value.split('::')[2].split(',');
          window.moveTo(Number(xAxis), Number(yAxis));
          break;
        case 'open':
          try {
            const { URL, name, specs } = JSON.parse(value.split('::')[2]);
            window.open(URL, name, specs);
          } catch {
            window.open(value.split('::')[2]);
          }
          break;
        default:
          if (command instanceof Event) {
            throw new SystemError('Unhandled Event', JSON.stringify(command));
          }
          throw new SystemError('Unhandled Event', command);
      }
    });
  };
  const start = (value: string) => {
    const commands = CommonEvents.getVerifiedEvents(WINDOW_COMMANDS, value);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, commands, value);
    execCommand(commands, value);
  };
  return { start };
})();
