import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_USER_SCRIPTS_MESSAGING } from './user-scripts.constant';

export class MainWorldService extends CoreService {
  static async click(elementFinder: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_USER_SCRIPTS_MESSAGING, methodName: 'click', message: elementFinder });
  }
}
