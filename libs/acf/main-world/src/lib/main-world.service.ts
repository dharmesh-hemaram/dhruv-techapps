import { Bypass } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from './main-world.constant';

export class MainWorldService extends CoreService {
  static async click(elementFinder: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING, methodName: 'click', message: elementFinder });
  }

  static async bypass(message: Bypass) {
    return await this.message({ messenger: RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING, methodName: 'bypass', message });
  }
}
