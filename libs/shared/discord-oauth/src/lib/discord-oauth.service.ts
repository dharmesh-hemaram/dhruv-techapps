import { RESPONSE_CODE, RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_DISCORD_OAUTH } from './discord-oauth.constant';
import { Discord } from './discord-oauth.types';

export class DiscordOauthService extends CoreService {
  static async login(extensionId: string) {
    return await this.message<RuntimeMessageRequest, RESPONSE_CODE.ERROR | Discord | undefined>(extensionId, { messenger: RUNTIME_MESSAGE_DISCORD_OAUTH, methodName: 'login' });
  }
  static async remove(extensionId: string) {
    return await this.message<RuntimeMessageRequest, RESPONSE_CODE.REMOVED>(extensionId, { messenger: RUNTIME_MESSAGE_DISCORD_OAUTH, methodName: 'remove' });
  }
}
