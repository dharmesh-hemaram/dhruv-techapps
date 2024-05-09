import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_DRIVE } from './google-drive.constant';
import { DriveFile, AUTO_BACKUP } from './google-drive.types';

export class GoogleDriveService extends CoreService {
  static async backup(extensionId: string) {
    return await this.message<RuntimeMessageRequest<boolean>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'backup', message: true });
  }

  static async autoBackup(extensionId: string, autoBackup?: AUTO_BACKUP) {
    return await this.message<RuntimeMessageRequest<AUTO_BACKUP>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'setAlarm', message: autoBackup });
  }

  static async list(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'list', message: true });
  }

  static async listWithContent(extensionId: string) {
    return await this.message<RuntimeMessageRequest<boolean>, Array<DriveFile>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'listWithContent', message: true });
  }

  static async restore(extensionId: string, id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'restore', message: { id, name } });
  }

  static async get(extensionId: string, id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'get', message: { id, name } });
  }

  static async delete(extensionId: string, id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>(extensionId, { messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'delete', message: { id, name } });
  }
}
