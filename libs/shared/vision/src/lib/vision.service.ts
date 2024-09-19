import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';

import { VisionImageRequest } from './vision-types';
import { RUNTIME_MESSAGE_VISION } from './vision.constant';

export class VisionService extends CoreService {
  static async imagesAnnotate(message: VisionImageRequest): Promise<string> {
    return await this.message<RuntimeMessageRequest<VisionImageRequest>, string>({
      messenger: RUNTIME_MESSAGE_VISION,
      methodName: 'imagesAnnotate',
      message: message,
    });
  }
}
