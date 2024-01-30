import { Logger } from '@dhruv-techapps/core-common';
import { SystemError } from '../error';
import CommonEvents from './common.events';
import { TabsService } from '@dhruv-techapps/acf-service';

const TAB_COMMANDS = ['reload', 'update'];

export const TabsEvents = (() => {
  const execCommand = (commands: Array<string | Event>, value: string) => {
    commands.forEach((command) => {
      switch (command) {
        case 'reload':
          TabsService.reload(chrome.runtime.id);
          break;
        case 'update':
          {
            const updateProperties = JSON.parse(value.split('::')[2]);
            TabsService.update(chrome.runtime.id, updateProperties);
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
    Logger.colorDebug('TabsEvents', { commands, value });
    execCommand(commands, value);
  };
  return { start };
})();
