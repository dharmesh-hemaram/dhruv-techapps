import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class GoogleBackupService extends CoreService {
  static async backup() {
    return await this.message<RuntimeMessageRequest<boolean>, string>({ messenger: RUNTIME_MESSAGE_ACF.ACF_BACKUP, methodName: 'backup', message: true });
  }

  static async restore(id: string, name: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_ACF.ACF_BACKUP, methodName: 'restore', message: { id, name } });
  }
}
