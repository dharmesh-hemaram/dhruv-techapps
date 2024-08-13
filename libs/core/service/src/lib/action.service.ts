import { ActionRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class ActionService extends CoreService {
  static async setBadgeBackgroundColor(details: chrome.action.BadgeColorDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeBackgroundColor', message: details });
  }

  static async setBadgeText(details: chrome.action.BadgeTextDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeText', message: details });
  }

  static async setIcon(details: chrome.action.TabIconDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setIcon', message: details });
  }

  static async setTitle(details: chrome.action.TitleDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setTitle', message: details });
  }
}
