import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class TabsService extends CoreService {
  static async reload(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'reload' });
  }

  static async update(extensionId: string, updateProperties: chrome.tabs.UpdateProperties) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'update', message: updateProperties });
  }
}
