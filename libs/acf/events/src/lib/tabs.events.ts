import { TabsService } from '@dhruv-techapps/acf-service';
import { SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const TAB_COMMANDS = ['reload', 'update'];

export const TabsEvents = (() => {
  const execCommand = (commands: Array<string | Event>, value: string) => {
    commands.forEach((command) => {
      switch (command) {
        case 'reload':
          TabsService.reload();
          break;
        case 'update':
          {
            const updateProperties = JSON.parse(value.split('::')[2]);
            TabsService.update(updateProperties);
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
    const commands = CommonEvents.getVerifiedEvents(TAB_COMMANDS, value);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, commands, value);
    execCommand(commands, value);
  };
  return { start };
})();
