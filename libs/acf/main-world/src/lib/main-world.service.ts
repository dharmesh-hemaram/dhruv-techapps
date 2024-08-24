import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from './main-world.constant';

export class MainWorldService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async click(elementFinder: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING, methodName: 'click', message: elementFinder });
  }
}
