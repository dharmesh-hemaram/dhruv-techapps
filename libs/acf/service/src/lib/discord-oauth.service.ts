import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class DiscordOauthService extends CoreService {
  static async login(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2, methodName: 'login' });
  }
  static async remove(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2, methodName: 'remove' });
  }
}
