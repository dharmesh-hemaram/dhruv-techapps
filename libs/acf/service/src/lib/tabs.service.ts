import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class TabsService extends CoreService {
  static async reload() {
    return await this.message({ messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'reload' });
  }

  static async update(updateProperties: chrome.tabs.UpdateProperties) {
    return await this.message({ messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'update', message: updateProperties });
  }
}
