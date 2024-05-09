import { CoreService } from '@dhruv-techapps/core-service';
import { GOOGLE_SCOPES, GoogleOauth2LoginResponse, GoogleOauth2RemoveResponse } from './google-oauth.types';
import { RUNTIME_MESSAGE_GOOGLE_OAUTH } from './google-oauth.constant';
import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';

export class GoogleOauthService extends CoreService {
  static async login(extensionId: string, scope: GOOGLE_SCOPES) {
    return await this.message<RuntimeMessageRequest<GOOGLE_SCOPES>, GoogleOauth2LoginResponse>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH, methodName: 'login', message: scope });
  }
  static async remove(extensionId: string, scope: GOOGLE_SCOPES) {
    return await this.message<RuntimeMessageRequest<GOOGLE_SCOPES>, GoogleOauth2RemoveResponse>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH, methodName: 'remove', message: scope });
  }
}
