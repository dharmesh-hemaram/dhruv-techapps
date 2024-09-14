import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_DISCORD_OAUTH } from './discord-oauth.constant';
import { Discord } from './discord-oauth.types';

export class DiscordOauthService extends CoreService {
  static async login() {
    return await this.message<RuntimeMessageRequest, Discord>({ messenger: RUNTIME_MESSAGE_DISCORD_OAUTH, methodName: 'discordLogin' });
  }
}
