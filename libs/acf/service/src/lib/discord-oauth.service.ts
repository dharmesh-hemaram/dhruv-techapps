import { Discord, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { RESPONSE_CODE, RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class DiscordOauthService extends CoreService {
  static async login(extensionId: string) {
    return await this.message<RuntimeMessageRequest, RESPONSE_CODE.ERROR | Discord | undefined>(extensionId, { messenger: RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2, methodName: 'login' });
  }
  static async remove(extensionId: string) {
    return await this.message<RuntimeMessageRequest, RESPONSE_CODE.REMOVED>(extensionId, { messenger: RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2, methodName: 'remove' });
  }
}
