import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_DRIVE } from './google-drive.constant';
import { AUTO_BACKUP, DriveFile } from './google-drive.types';

export class GoogleDriveService extends CoreService {
  static async backup() {
    return await this.message<RuntimeMessageRequest<boolean>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'backup', message: true });
  }

  static async autoBackup(autoBackup?: AUTO_BACKUP) {
    return await this.message<RuntimeMessageRequest<AUTO_BACKUP>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'setAlarm', message: autoBackup });
  }

  static async list() {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'list', message: true });
  }

  static async listWithContent() {
    return await this.message<RuntimeMessageRequest<boolean>, Array<DriveFile>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'listWithContent', message: true });
  }

  static async restore(id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'restore', message: { id, name } });
  }

  static async get(id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'get', message: { id, name } });
  }

  static async delete(id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'delete', message: { id, name } });
  }
}
