import { ActionRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class ActionService extends CoreService {
  static async setBadgeBackgroundColor(extensionId: string, details: chrome.action.BadgeColorDetails) {
    return await this.message<ActionRequest>(extensionId, { messenger: 'action', methodName: 'setBadgeBackgroundColor', message: details });
  }

  static async setBadgeText(extensionId: string, details: chrome.action.BadgeTextDetails) {
    return await this.message<ActionRequest>(extensionId, { messenger: 'action', methodName: 'setBadgeText', message: details });
  }

  static async setIcon(extensionId: string, details: chrome.action.TabIconDetails) {
    return await this.message<ActionRequest>(extensionId, { messenger: 'action', methodName: 'setIcon', message: details });
  }

  static async setTitle(extensionId: string, details: chrome.action.TitleDetails) {
    return await this.message<ActionRequest>(extensionId, { messenger: 'action', methodName: 'setTitle', message: details });
  }
}
