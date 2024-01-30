import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { AcfService } from './service';

export class TabsService extends AcfService {
  static async reload(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'reload' });
  }

  static async update(extensionId: string, updateProperties: chrome.tabs.UpdateProperties) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'update', message: updateProperties });
  }
}
